"use client";

import { useState, useTransition } from "react";
import { postComment, updateComment, deleteComment } from "@/lib/actions/blog";
import { MessageSquare, Send, Loader2, User as UserIcon, AlertCircle, Star, Trash2, Edit2, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const StarRating = ({ rating, setRating, interactive = true }: { rating: number, setRating?: (r: number) => void, interactive?: boolean }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => interactive && setRating?.(s)}
          onMouseEnter={() => interactive && setHoverRating(s)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`
            ${interactive ? 'hover:scale-125 transition-all duration-200 cursor-pointer active:scale-95' : ''} 
            ${s <= (hoverRating || rating) ? 'text-amber-400' : 'text-slate-200'}
          `}
        >
          <Star 
            size={interactive ? 28 : 14} 
            fill={s <= (hoverRating || rating) ? "currentColor" : "transparent"} 
            className="transition-colors"
          />
        </button>
      ))}
    </div>
  );
};

export default function CommentSection({ postId, comments, session }: { postId: string, comments: any[], session: any }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);

  const startEdit = (comment: any) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setEditRating(comment.rating);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
    setEditRating(0);
  };

  const handleUpdate = (id: string) => {
    if (!editContent.trim()) return;
    startTransition(async () => {
      const result = await updateComment(id, { content: editContent, rating: editRating });
      if (result.success) {
        toast.success("Review updated!");
        cancelEdit();
        router.refresh();
      } else {
        toast.error("Failed to update", { description: result.error });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    startTransition(async () => {
      const result = await deleteComment(id);
      if (result.success) {
        toast.success("Review deleted!");
        router.refresh();
      } else {
        toast.error("Failed to delete", { description: result.error });
      }
    });
  };

  const handlePost = () => {
    if (!content.trim()) return;
    
    startTransition(async () => {
      setError("");
      const result = await postComment(postId, {
        content,
        rating,
      });

      if (result.success) {
        toast.success("Review posted!", {
          description: "Thank you for sharing your perspective."
        });
        setContent("");
        setRating(0);
        router.refresh();
      } else {
        toast.error("Failed to post review", {
          description: result.error || "Please try again later."
        });
        setError(result.error || "Failed to post comment");
      }
    });
  };

  return (
    <div className="mt-25 pt-10  border-slate-100">
      <div className="flex items-center gap-4 mb-12">
        <h3 className="text-3xl font-black text-slate-900">Discussion & Reviews</h3>
        <span className="px-4 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-sm">
          {comments.length}
        </span>
      </div>

      <div className="bg-slate-50 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12">
        {/* Comment Form */}
        <div className="flex flex-col gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
            <div className="hidden md:flex h-14 w-14 rounded-2xl bg-brand-forest text-white flex-col items-center justify-center shrink-0 shadow-lg shadow-forest-500/20">
              <UserIcon size={24} />
            </div>
            
            <div className="grow w-full space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-full sm:w-auto">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Overall Rating</p>
                   <StarRating rating={rating} setRating={setRating} />
                </div>
              </div>

              <div className="relative group">
                 <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isPending}
                  className="w-full bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 min-h-[120px] sm:min-h-[150px] focus:ring-4 focus:ring-brand-cyan/10 focus:border-brand-cyan outline-none transition-all placeholder:text-slate-300 text-slate-900 shadow-sm" 
                  placeholder="Share your thoughts or leave a review..."
                 ></textarea>
                 {error && (
                   <div className="mt-4 flex items-center gap-2 text-rose-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={14} />
                      {error}
                   </div>
                 )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <p className="text-sm text-slate-400 font-medium italic text-center sm:text-left">
                  {session ? `Logged in as ${session.name}` : "Posting as Anonymous"}
                </p>
                <button 
                  onClick={handlePost}
                  disabled={isPending || !content.trim() || rating === 0}
                  className="flex items-center justify-center w-full sm:w-auto gap-3 rounded-2xl bg-brand-forest px-8 py-4 text-sm font-bold text-white transition-all hover:bg-brand-dark hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={18} />}
                  Post Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6 sm:space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 font-black shadow-sm shrink-0">
                  {(comment.user?.name || comment.guestName || "?").charAt(0)}
               </div>
               <div className="grow p-6 sm:p-8 rounded-3xl bg-white shadow-sm border border-slate-100/50">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                     <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-slate-900">{comment.user?.name || comment.guestName}</span>
                        {editingId === comment.id ? (
                           <StarRating rating={editRating} setRating={setEditRating} />
                        ) : (
                           <StarRating rating={comment.rating} interactive={false} />
                        )}
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                           {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                     </div>
                  </div>
                  
                  {editingId === comment.id ? (
                     <div className="space-y-4">
                        <textarea 
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-4 min-h-[100px] focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all text-slate-900 text-sm shadow-sm"
                        ></textarea>
                        <div className="flex gap-2">
                           <button onClick={() => handleUpdate(comment.id)} disabled={isPending} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-forest px-4 py-2 text-xs font-bold text-white hover:bg-brand-dark transition-all disabled:opacity-50">
                              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
                           </button>
                           <button onClick={cancelEdit} disabled={isPending} className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-50">
                              <X size={14} /> Cancel
                           </button>
                        </div>
                     </div>
                  ) : (
                     <>
                        <p className="text-slate-600 leading-relaxed font-medium">
                           {comment.content}
                        </p>
                        {session && session.id === comment.userId && (
                           <div className="flex gap-3 mt-4 pt-4 border-t border-slate-50">
                              <button onClick={() => startEdit(comment)} disabled={isPending} className="text-xs font-bold text-brand-cyan hover:text-brand-dark flex items-center gap-1 transition-colors disabled:opacity-50">
                                 <Edit2 size={12} /> Edit
                              </button>
                              <button onClick={() => handleDelete(comment.id)} disabled={isPending} className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors disabled:opacity-50">
                                 <Trash2 size={12} /> Delete
                              </button>
                           </div>
                        )}
                     </>
                  )}
               </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-10 opacity-40">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Be the first to share a localized perspective</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
