"use client";

import { useTransition } from "react";
import { deletePost } from "@/lib/actions/blog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DeletePostButton({ id, title }: { id: string, title: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    startTransition(async () => {
      const result = await deletePost(id);
      if (result.success) {
        toast.success("Post Deleted", {
          description: `"${title}" has been successfully removed.`
        });
      } else {
        toast.error("Delete Failed", {
          description: result.error || "Could not delete the post."
        });
      }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-slate-200 hover:text-rose-500 transition-colors disabled:opacity-50"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
