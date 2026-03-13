"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteComment } from "@/lib/actions/blog";

export default function DeleteCommentButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to moderate this comment?")) return;

    startTransition(async () => {
      const result = await deleteComment(id);
      if (result.success) {
        toast.success("Comment Removed", {
          description: "The comment has been successfully moderated."
        });
      } else {
        toast.error("Action Failed", {
          description: result.error || "Could not remove the comment."
        });
      }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="h-10 w-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center transition-all hover:bg-rose-100 hover:scale-110 active:scale-95 disabled:opacity-50"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
