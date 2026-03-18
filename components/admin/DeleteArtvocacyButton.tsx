"use client";

import { Trash2 } from "lucide-react";
import { deleteArtvocacy } from "@/lib/actions/artvocacy";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteArtvocacyButtonProps {
  id: string;
  title: string;
}

export default function DeleteArtvocacyButton({ id, title }: DeleteArtvocacyButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm(`Delete highlight "${title}"?`)) {
      try {
        const res = await deleteArtvocacy(id);
        if (res.success) {
          toast.success("Artvocacy deleted!");
          router.refresh();
        } else {
          toast.error("Error: " + res.error);
        }
      } catch (err: any) {
        toast.error("Something went wrong");
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
