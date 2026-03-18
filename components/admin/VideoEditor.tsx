"use client";

import { useState, useTransition } from "react";
import { 
  Save, 
  Loader2, 
  ArrowLeft, 
  Play,
  CheckCircle2,
  XCircle,
  Hash
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createVideo, updateVideo } from "@/lib/actions/videos";
import { toast } from "sonner";

export default function VideoEditor({ initialData }: { initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [order, setOrder] = useState(initialData?.order || 0);
  const [active, setActive] = useState(initialData?.active ?? true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    if (!title || !url) {
      toast.error("Missing Fields", {
        description: "Please provide both a title and a YouTube URL."
      });
      return;
    }

    startTransition(async () => {
      let result;
      const videoData = { title, url, order: Number(order), active };

      if (initialData?.id) {
        result = await updateVideo(initialData.id, videoData);
      } else {
        result = await createVideo(videoData);
      }
      
      if (result.success) {
        toast.success(initialData?.id ? "Video Updated!" : "Video Added!");
        router.push("/admin/videos");
        router.refresh();
      } else {
        toast.error("Save Failed", { description: result.error });
      }
    });
  };

  // Helper to get thumbnail
  const getThumbnail = (videoUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "/images/placeholder-video.jpg";
  };

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-8 pb-20">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md py-4 border-b border-slate-100 -mx-6 px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Link href="/admin/videos" className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-forest transition-all shadow-sm">
                <ArrowLeft size={18} />
            </Link>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">{initialData ? 'Edit Video' : 'New Video'}</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Campaign Media</p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black bg-brand-forest text-white shadow-xl shadow-brand-forest/10 hover:bg-brand-dark transition-all disabled:opacity-50"
          >
             {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
             <span>{initialData ? "Update" : "Add Video"}</span>
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-sm space-y-6">
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Video Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Oil Extraction and Water Pollution"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-forest/5 placeholder:text-slate-300 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">YouTube URL</label>
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                            <Play size={18} />
                        </div>
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-brand-forest/5 placeholder:text-slate-300 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Display Order</label>
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                                <Hash size={16} />
                            </div>
                            <input 
                                type="number" 
                                value={order}
                                onChange={(e) => setOrder(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-brand-forest/5 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                        <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-1">
                            <button 
                                onClick={() => setActive(true)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <CheckCircle2 size={14} />
                                Active
                            </button>
                            <button 
                                onClick={() => setActive(false)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${!active ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <XCircle size={14} />
                                Hidden
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar/Preview */}
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-4xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/20 rounded-full blur-3xl z-0"></div>
                
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6">Live Preview</h4>
                
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-800 shadow-inner">
                    <img 
                      src={getThumbnail(url)} 
                      className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
                      alt="Thumbnail Preview"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 scale-90 group-hover:scale-100 transition-transform">
                            <Play size={20} fill="currentColor" />
                        </div>
                    </div>
                </div>
                
                <h5 className="text-white font-black text-sm mb-1 leading-tight line-clamp-2">{title || 'Untitled Video'}</h5>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Voice of the Frontline</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-4xl p-8">
                <p className="text-emerald-800 text-xs font-medium leading-relaxed">
                    <strong>Pro Tip:</strong> Ensure you use the direct YouTube video link. Thumbnails will be automatically generated for the grid display.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
