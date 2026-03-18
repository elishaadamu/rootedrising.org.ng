"use client";

import { useTransition } from "react";
import { deleteVideo } from "@/lib/actions/videos";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteVideoButton({ id, title }: { id: string, title: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete this video: "${title}"?`)) return;

    startTransition(async () => {
      const result = await deleteVideo(id);
      if (result.success) {
        toast.success("Video Deleted");
        router.refresh();
      } else {
        toast.error("Delete Failed", {
          description: result.error || "Could not delete the video."
        });
      }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-50"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
