"use client";

import { useState } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { changePassword } from "@/lib/actions/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Validation Error", {
        description: "New passwords do not match."
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Weak Password", {
        description: "Password must be at least 6 characters long."
      });
      return;
    }

    setIsPending(true);
    try {
      const result = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        toast.success("Security Updated", {
          description: "Your password has been changed successfully."
        });
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error("Update Failed", {
          description: result.error || "Could not change password."
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred."
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
      >
        <div className="p-8 sm:p-10">
          <div className="text-center mb-10">
            <h3 className="text-xl font-black text-slate-900">Security Credentials</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Update your account password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.oldPassword}
                  onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-forest/5 focus:border-brand-forest transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Password</label>
              <input
                type="password"
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-cyan/5 focus:border-brand-cyan transition-all"
                placeholder="Min. 6 characters"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-cyan/5 focus:border-brand-cyan transition-all"
                placeholder="Repeat new password"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-3 bg-brand-forest text-white py-4 rounded-2xl text-sm font-black shadow-xl shadow-brand-forest/10 hover:bg-brand-dark transition-all active:scale-95 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
      
      <div className="mt-8 p-6 rounded-3xl bg-amber-50/50 border border-amber-100/50 text-center">
        <p className="text-xs text-amber-700 leading-relaxed font-medium">
          <strong className="block mb-1">Security Tip:</strong>
          Use a strong, unique password with a mix of letters, numbers, and symbols to keep your administrative account secure.
        </p>
      </div>
    </div>
  );
}
