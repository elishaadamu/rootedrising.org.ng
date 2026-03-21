"use client";

import { useState } from "react";
import { RefreshCw, Check, AlertCircle } from "lucide-react";
import { syncMarkdownPosts, normalizeBlogSections } from "@/lib/actions/blog";
import { toast } from "sonner";

export default function SyncMarkdownButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // 1. Sync from Markdown
      const syncResult = await syncMarkdownPosts();
      
      // 2. Normalize Sections (even if sync had no new files)
      const normResult = await normalizeBlogSections();

      if (syncResult.success && normResult.success) {
        toast.success(`Content Synchronized`, {
          description: `Imported ${syncResult.count || 0} md files and normalized ${normResult.count || 0} posts.`
        });
        window.location.reload();
      } else {
        toast.error("Process failed partially.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during sync.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-100 bg-white px-6 py-3.5 sm:px-8 sm:py-4 text-sm font-bold text-slate-600 transition-all hover:border-brand-forest hover:text-brand-forest active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto shadow-sm"
    >
      <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
      {isSyncing ? "Syncing..." : "Sync with Markdown"}
    </button>
  );
}
