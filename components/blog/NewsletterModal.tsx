"use client";

import { useState } from "react";
import { X, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeNewsletter } from "@/lib/actions/newsletter";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // We pass FormData to the server action
    const formData = new FormData();
    formData.append("email", email);
    
    try {
      const result = await subscribeNewsletter(formData);
      
      if (result.success) {
         setStatus("success");
         setMessage("Success! You've joined our movement for climate resilience.");
         setTimeout(() => {
           onClose();
           setEmail("");
           setStatus("idle");
         }, 4000);
      } else {
         setStatus("error");
         setMessage(result.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("A network error occurred. Please check your connection.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[3rem] bg-white p-10 sm:p-12 shadow-2xl border border-white/20"
          >
            <button
              onClick={onClose}
              className="absolute right-8 top-8 rounded-full bg-slate-50 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-90"
            >
              <X size={20} />
            </button>

            <div className="text-center font-outfit">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-brand-forest/10 text-brand-forest shadow-inner group">
                <Mail size={36} className="transition-transform group-hover:scale-110" />
              </div>

              <h3 className="mb-4 text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Rooted in Truth, <br/><span className="text-brand-orange">Rising for Justice</span>
              </h3>
              <p className="mb-8 text-slate-500 font-medium font-outfit leading-relaxed">
                Rooted Rising is a dynamic media advocacy initiative, harnessing the power of storytelling, art, and grassroots activism to ignite climate action and gender equality. Get the latest climate insights and impact stories delivered straight to your inbox.
              </p>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-6 py-4"
                >
                  <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                     <CheckCircle2 size={40} />
                  </div>
                  <p className="text-emerald-700 font-bold max-w-xs mx-auto">{message}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your active email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "loading"}
                      className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-brand-forest/5 focus:border-brand-forest transition-all placeholder:text-slate-400"
                    />
                  </div>
                  {status === "error" && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs font-black text-rose-500 flex items-center justify-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      {message}
                    </motion.p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-brand-forest py-5 text-sm font-black text-white hover:bg-brand-dark transition-all shadow-xl shadow-forest-500/10 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                  >
                    {status === "loading" ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Subscribe Now"
                    )}
                  </button>
                  <p className="text-[10px] text-slate-400 font-medium mt-4">
                    Zero spam. Only high-impact climate intelligence.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
