"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Globe, Image as ImageIcon, Layout, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createPamphlet, updatePamphlet } from "@/lib/actions/pamphlets";
import { toast } from "sonner";
import Image from "next/image";

import CloudinaryUpload from "@/components/admin/CloudinaryUpload";

interface PamphletEditorProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function PamphletEditor({ initialData, isEditing = false }: PamphletEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    image: initialData?.image || "/images/world-day-of-justice.png",
    content: initialData?.content || "",
    url: initialData?.url || "",
    active: initialData?.active ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast.error("Please upload an image first");
      return;
    }

    setLoading(true);

    try {
      const res = isEditing 
        ? await updatePamphlet(initialData.id, formData)
        : await createPamphlet(formData);

      if (res.success) {
        toast.success(isEditing ? "Pamphlet updated!" : "Pamphlet created!");
        router.push("/admin/pamphlets");
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <Link 
            href="/admin/pamphlets" 
            className="group flex items-center gap-2 text-slate-400 hover:text-brand-orange transition-all mb-4 font-bold text-sm tracking-tight"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Pamphlets
          </Link>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {isEditing ? "Edit Pamphlet" : "Create New Pamphlet"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">Configure your campaign resources with premium visual styles.</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-2xl bg-brand-forest px-10 py-4 text-sm font-black text-white shadow-2xl shadow-forest-500/20 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Save size={20} />
          )}
          {isEditing ? "Save Changes" : "Publish Pamphlet"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-8">
           <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 mb-2">
                 <div className="h-8 w-8 rounded-xl bg-orange-100 flex items-center justify-center text-brand-orange">
                    <Layout size={18} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900">Content Details</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Display Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. World Day of Justice"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-extrabold focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all placeholder:text-slate-300"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Overlay Content (HTML allowed)</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    placeholder="Brief description that appears inside the card center..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-slate-700 font-medium focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all placeholder:text-slate-300 resize-none"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Learn More Link (Instagram/PDF)</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-orange transition-colors">
                       <Globe size={18} />
                    </div>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://instagram.com/p/..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>
           </section>

           <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 mb-2">
                 <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                    <ImageIcon size={18} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900">Background Image</h3>
              </div>
              
              <div className="space-y-6">
                 <CloudinaryUpload
                   defaultValue={formData.image}
                   onUpload={(url) => setFormData({ ...formData, image: url })}
                 />
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                   This image will be used as the background for the pamphlet card.
                 </p>
              </div>
           </section>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-2 space-y-8">
           <div className="sticky top-10 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Live Card Preview</h3>
                 <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase transition-opacity">
                    <CheckCircle2 size={12} />
                    Auto-rendering
                 </div>
              </div>

              {/* The actual Card Preview mirroring the Campaign page */}
              <div className="relative aspect-[3/4] rounded-4xl overflow-hidden shadow-2xl bg-brand-navy border border-white/5 group">
                {formData.image && (
                   <img 
                     src={formData.image} 
                     alt="Preview" 
                     className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[20%]"
                   />
                )}
                <div className="absolute inset-0 bg-brand-navy/60 p-6 flex items-center justify-center">
                   <div className="border border-white/40 w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <div className="text-white text-[12px] font-medium leading-relaxed mb-6 opacity-90 line-clamp-6" dangerouslySetInnerHTML={{ __html: formData.content || "Description will appear here..." }}></div>
                      <div className="w-12 h-px bg-white/30 mb-4"></div>
                      <h3 className="text-white font-black text-xl uppercase tracking-widest leading-tight">{formData.title || "Untitled Pamphlet"}</h3>
                      
                      {/* Branded Corner */}
                      <div className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/90 p-2 shadow-xl border border-white/20">
                         <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Visibility Settings */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="font-black uppercase tracking-widest text-[10px] text-brand-orange mb-1">Status Settings</p>
                       <p className="text-lg font-black">{formData.active ? "Published" : "Hidden"}</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, active: !formData.active })}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${formData.active ? 'bg-emerald-500' : 'bg-slate-700'}`}
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
