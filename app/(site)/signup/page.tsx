"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Github, Linkedin, AlertCircle, User, Phone, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useState, useActionState, useEffect } from "react";
import { signup } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await signup(formData);
      if (result.success) {
        toast.success("Account created!", {
          description: "Welcome to the REACT network."
        });
      } else if (result.error) {
        toast.error("Signup failed", {
          description: result.error
        });
      }
      return result;
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push("/admin");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 h-[600px] w-[600px] rounded-full bg-brand-cyan/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-48 -mb-48 h-[600px] w-[600px] rounded-full bg-brand-forest/10 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto w-full max-w-2xl px-6 py-12 relative z-10">
        <div className="text-center mb-10">
          <Logo isDark className="justify-center mb-10 scale-125" />
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-600 font-medium">Register to join the REACT platform</p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-12 border border-slate-100"
        >
          {state?.success ? (
            <div className="text-center py-10 space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={40} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Registration Successful!</h2>
              <p className="text-slate-600">Your account has been created. Redirecting to dashboard...</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-8">
              {state?.error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-4 text-red-700 animate-in fade-in slide-in-from-top-4">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-bold">{state.error}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                    <div className="relative group/input transition-all">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-cyan transition-colors">
                        <User size={18} />
                      </div>
                      <input 
                        type="text" 
                        name="name"
                        required
                        className="w-full bg-slate-50 rounded-2xl border border-slate-200 pl-14 pr-6 py-4 focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                        placeholder="John Doe" 
                      />
                    </div>
                  </div>

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
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">Password</label>
                    <div className="relative group/input transition-all">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-cyan transition-colors">
                        <Lock size={18} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        minLength={8}
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

                  <div className="space-y-3">
                    <label className="block mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">Confirm Password</label>
                    <div className="relative group/input transition-all">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-cyan transition-colors">
                        <Lock size={18} />
                      </div>
                      <input 
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        className="w-full bg-slate-50 rounded-2xl border border-slate-200 pl-14 pr-14 py-4 focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                        placeholder="••••••••••••" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-cyan transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full rounded-2xl bg-brand-forest px-8 py-5 text-lg font-bold text-white shadow-xl shadow-forest-500/10 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 mt-10 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <LogIn size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-slate-600 font-medium mt-10">
            Already have an account? <Link href="/login" className="text-brand-forest font-black hover:text-brand-dark hover:underline transition-all">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
