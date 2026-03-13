"use client";

import { useState, useTransition } from "react";
import { updateComment } from "@/lib/actions/blog";
import { Save, Loader2, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CommentEditor({ initialData }: { initialData: any }) {
  const [content, setContent] = useState(initialData.content);
  const [rating, setRating] = useState(initialData.rating);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    if (!content.trim()) {
      toast.error("Required Field Missing", { description: "Comment content cannot be empty." });
      return;
    }

    startTransition(async () => {
      const result = await updateComment(initialData.id, { content, rating });
      if (result.success) {
        toast.success("Comment Updated", { description: "The community review has been modified." });
        router.push("/admin/comments");
      } else {
        toast.error("Update Failed", { description: result.error || "An unexpected error occurred." });
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-6">
            <Link href="/admin/comments" className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-forest transition-colors shadow-sm">
               <ArrowLeft size={20} />
            </Link>
            <div>
               <h2 className="text-2xl font-black text-slate-900">Edit Review</h2>
               <p className="text-sm font-medium text-slate-500">Moderate and refine community feedback.</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-5xl p-10 shadow-sm border border-slate-100 space-y-8">
          <div className="space-y-4 shadow-sm border border-slate-100 p-6 rounded-3xl bg-slate-50 flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Author</p>
                 <p className="text-sm font-bold text-slate-900">{initialData.user?.name || initialData.guestName || "Guest"}</p>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Target Story</p>
                 <p className="text-sm font-bold text-brand-forest">{initialData.post?.title || "Unknown"}</p>
              </div>
          </div>

          <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Review Rating</label>
              <div className="gap-2 bg-slate-50 p-4 rounded-xl inline-flex group/stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`hover:scale-125 transition-transform duration-200 cursor-pointer active:scale-95 ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}
                    >
                        <Star size={28} fill={s <= rating ? "currentColor" : "transparent"} className="transition-colors" />
                    </button>
                  ))}
              </div>
          </div>

          <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Review Content</label>
              <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-base font-medium focus:outline-none focus:ring-4 focus:ring-brand-cyan/10 transition-all resize-y"
              />
          </div>

          <div className="pt-6 border-t border-slate-50 text-right flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-forest px-8 py-4 text-sm font-bold text-white shadow-xl shadow-forest-500/10 transition-all hover:bg-brand-dark hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={18} />}
                Save Changes
              </button>
          </div>
      </div>
    </div>
  );
}
