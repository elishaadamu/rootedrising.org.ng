"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Github, Linkedin, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useState, useActionState, useEffect } from "react";
import { login } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await login(formData);
      if (result.success) {
        toast.success("Welcome back!", {
          description: "Logged in successfully."
        });
        router.push("/admin");
      } else if (result.error) {
        toast.error("Login failed", {
          description: result.error
        });
      }
      return result;
    },
    null
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 h-[600px] w-[600px] rounded-full bg-brand-cyan/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-48 -mb-48 h-[600px] w-[600px] rounded-full bg-brand-forest/10 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto w-full max-w-xl px-6 py-12 relative z-10">
        <div className="text-center mb-10">
          <Logo isDark className="justify-center mb-10 scale-125" />
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600 font-medium">Log in to your REACT ambassador dashboard</p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-12 border border-slate-100"
        >
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-4 text-red-700 animate-in fade-in slide-in-from-top-4">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-bold">{state.error}</p>
              </div>
            )}

            <div className="space-y-3">
              <label className="block mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">Email Address</label>
              <div className="relative group/input transition-all">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-cyan transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full bg-slate-50 rounded-2xl border border-slate-200 pl-14 pr-6 py-4 focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                  placeholder="name@example.com" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">Password</label>
                <Link href="#" className="text-sm font-bold text-brand-forest hover:text-brand-dark transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group/input transition-all">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-cyan transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full bg-slate-50 rounded-2xl border border-slate-200 pl-14 pr-14 py-4 focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                  placeholder="••••••••••••" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-cyan transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full rounded-2xl bg-brand-forest px-8 py-5 text-lg font-bold text-white shadow-xl shadow-forest-500/10 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <LogIn size={20} />
                </>
              )}
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 mt-10 mb-10">
             <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
             <p className="text-xs font-semibold text-amber-800 leading-relaxed">Only active staff currently have access.</p>
          </div>

          <p className="text-center text-slate-600 font-medium">
            Don't have an account? <Link href="/signup" className="text-brand-forest font-black hover:text-brand-dark hover:underline transition-all">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
