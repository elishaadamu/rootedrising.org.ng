"use client";

import { Mail, Calendar, Trash2, Loader2 } from "lucide-react";
import { deleteSubscriber } from "@/lib/actions/newsletter";
import { useTransition } from "react";
import { toast } from "sonner";

export default function SubscriberList({ subscribers }: { subscribers: any[] }) {
  const [isPending, startTransition] = useTransition();

  const onDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;

    startTransition(async () => {
      const result = await deleteSubscriber(id);
      if (result.success) {
        toast.success("Subscriber removed");
      } else {
        toast.error(result.error || "Failed to remove subscriber");
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl sm:rounded-5xl overflow-hidden shadow-sm border border-slate-100">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-0">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subscriber</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date Joined</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 sm:px-8 py-4 sm:py-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Mail size={16} className="sm:size-[18px]" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[150px] sm:max-w-none">{sub.email}</span>
                  </div>
                </td>
                <td className="px-4 sm:px-8 py-4 sm:py-6">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium whitespace-nowrap">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(sub.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </td>
                <td className="px-4 sm:px-8 py-4 sm:py-6 text-right">
                  <button 
                    onClick={() => onDelete(sub.id, sub.email)}
                    disabled={isPending}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors disabled:opacity-50"
                  >
                    {isPending ? <Loader2 size={16} className="animate-spin sm:size-[18px]" /> : <Trash2 size={16} className="sm:size-[18px]" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {subscribers.length === 0 && (
        <div className="py-16 sm:py-20 text-center">
          <div className="h-16 w-16 sm:h-20 sm:w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Mail size={28} className="sm:size-8" />
          </div>
          <p className="text-sm sm:text-base text-slate-400 font-medium italic px-4">No subscribers found in the database.</p>
        </div>
      )}
    </div>
  );
}
