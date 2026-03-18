"use client";

import { Trash2 } from "lucide-react";
import { deletePamphlet } from "@/lib/actions/pamphlets";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeletePamphletButtonProps {
  id: string;
  title: string;
}

export default function DeletePamphletButton({ id, title }: DeletePamphletButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete the pamphlet "${title}"?`)) {
      try {
        const res = await deletePamphlet(id);
        if (res.success) {
          toast.success("Pamphlet deleted successfully!");
          router.refresh();
        } else {
          toast.error("Failed to delete: " + res.error);
        }
      } catch (err: any) {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm tracking-tight"
    >
      <Trash2 size={18} />
    </button>
  );
}
