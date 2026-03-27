"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Play, Type, Settings, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createArtvocacy, updateArtvocacy } from "@/lib/actions/artvocacy";
import { toast } from "sonner";

interface ArtvocacyEditorProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ArtvocacyEditor({ initialData, isEditing = false }: ArtvocacyEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    url: initialData?.url || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    active: initialData?.active ?? true
  });

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const id = getYouTubeId(formData.url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = isEditing 
        ? await updateArtvocacy(initialData.id, formData)
        : await createArtvocacy(formData);

      if (res.success) {
        toast.success(isEditing ? "Artvocacy updated!" : "Artvocacy created!");
        router.push("/admin/artvocacy");
        router.refresh();
      } else {
        toast.error("Error: " + res.error);
      }
    } catch (err: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <Link 
            href="/admin/artvocacy" 
            className="group flex items-center gap-2 text-slate-400 hover:text-brand-orange transition-all mb-4 font-bold text-sm tracking-tight"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Artvocacy
          </Link>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {isEditing ? "Edit Artvocacy" : "Create New Artvocacy"}
          </h2>
          <p className="text-slate-500 font-medium">Manage your featured art-based climate storytelling.</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-2xl bg-brand-forest px-10 py-4 text-sm font-black text-white shadow-2xl shadow-forest-500/20 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
             <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Save size={20} />
          )}
          {isEditing ? "Update Highlight" : "Publish Highlight"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
           <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-xl bg-orange-100 flex items-center justify-center text-brand-orange">
                    <Type size={18} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900">Header Information</h3>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Featured Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Artvocacy Video Title"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-black focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all placeholder:text-slate-300"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Short Description</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={3}
                      placeholder="Brief context for the artvocacy highlight..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-slate-700 font-medium focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all placeholder:text-slate-300 resize-none"
                    />
                 </div>
              </div>
           </section>

           <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                    <Play size={18} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900">Video Integration</h3>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">YouTube Embed URL</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                    />
                 </div>
              </div>
           </section>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="sticky top-10 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Section Preview</h3>
                 <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-tight">
                    <CheckCircle2 size={12} />
                    Live Video Feed
                 </div>
              </div>

              {/* The high-impact preview */}
              <div className="relative aspect-video rounded-4xl overflow-hidden shadow-2xl bg-black border border-white/10 group">
                {id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=0&mute=1`}
                    title="Preview"
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-300">
                     <Play size={48} />
                  </div>
                )}
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <div className="flex items-center gap-2">
                          <Settings size={14} className="text-brand-orange" />
                          <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">Highlight Status</p>
                       </div>
                       <p className="text-xl font-black">{formData.active ? "Featured Active" : "Disabled"}</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, active: !formData.active })}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${formData.active ? 'bg-brand-orange' : 'bg-slate-700'}`}
                    >
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${formData.active ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
