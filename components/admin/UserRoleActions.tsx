"use client";

import { useState, useRef, useEffect } from "react";
import { updateUserRole, deleteUser } from "@/lib/actions/users";
import { toast } from "sonner";
import { 
  MoreVertical, 
  ShieldCheck, 
  User as UserIcon, 
  Trash2,
  Loader2,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserRoleActionsProps {
  user: {
    id: string;
    role: string;
    name: string | null;
  };
  currentAdminId?: string;
}

export default function UserRoleActions({ user, currentAdminId }: UserRoleActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleUpdate = async (newRole: string) => {
    if (newRole === user.role) {
      setIsOpen(false);
      return;
    }
    
    setIsUpdating(true);
    setIsOpen(false);
    const result = await updateUserRole(user.id, newRole);
    setIsUpdating(false);

    if (result.success) {
      toast.success(`User role updated to ${newRole}`);
    } else {
      toast.error(result.error || "Failed to update role");
    }
  };

  const handleDeleteUser = async () => {
    if (user.id === currentAdminId) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
        return;
    }

    setIsUpdating(true);
    const result = await deleteUser(user.id);
    setIsUpdating(false);

    if (result.success) {
      toast.success("User deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete user");
    }
  };

  return (
    <div className="relative flex items-center justify-end gap-2" ref={dropdownRef}>
      {isUpdating && <Loader2 size={16} className="animate-spin text-brand-forest" />}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-100 disabled:opacity-50" 
        disabled={isUpdating}
      >
        <MoreVertical size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-2"
          >
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black px-3 py-2">Account Control</p>
            
            <button 
              onClick={() => handleRoleUpdate("ADMIN")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${user.role === 'ADMIN' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className={user.role === 'ADMIN' ? 'text-rose-500' : 'text-slate-400'} /> Admin
              </div>
              {user.role === "ADMIN" && <Check size={14} />}
            </button>

            <button 
              onClick={() => handleRoleUpdate("EDITOR")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${user.role === 'EDITOR' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className={user.role === 'EDITOR' ? 'text-emerald-500' : 'text-slate-400'} /> Editor
              </div>
              {user.role === "EDITOR" && <Check size={14} />}
            </button>

            <button 
              onClick={() => handleRoleUpdate("USER")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${user.role === 'USER' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-2">
                <UserIcon size={16} className={user.role === 'USER' ? 'text-blue-500' : 'text-slate-400'} /> Normal User
              </div>
              {user.role === "USER" && <Check size={14} />}
            </button>

            <div className="h-px bg-slate-50 my-2 mx-2"></div>

            <button 
              onClick={handleDeleteUser}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              disabled={user.id === currentAdminId}
            >
              <Trash2 size={16} /> Delete User
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
