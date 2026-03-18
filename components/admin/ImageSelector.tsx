"use client";

import { useEffect, useState } from "react";
import { Upload, ImageIcon, X, Loader2, Globe, Search, Grid, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { getLocalImages } from "@/lib/actions/images";
import CloudinaryUpload from "./CloudinaryUpload";

interface ImageSelectorProps {
  onSelect: (url: string) => void;
  defaultValue?: string;
  label?: string;
}

export default function ImageSelector({ onSelect, defaultValue, label = "Featured Image" }: ImageSelectorProps) {
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [mode, setMode] = useState<"upload" | "library" | "url">("upload");
  const [preview, setPreview] = useState(defaultValue || "");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchLocal() {
      setLoadingLocal(true);
      const res = await getLocalImages();
      if (res.success) {
        setLocalImages(res.images);
      }
      setLoadingLocal(false);
    }
    fetchLocal();
  }, []);

  const filteredLocal = localImages.filter(img => img.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelect = (url: string) => {
    setPreview(url);
    onSelect(url);
  };

  return (
    <div className="space-y-6">
      {preview && (
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border-4 border-white bg-slate-100">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             <button 
               onClick={() => { setPreview(""); onSelect(""); }}
               className="h-10 w-10 rounded-full bg-white text-rose-500 shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
             >
                <X size={20} />
             </button>
          </div>
          <div className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg scale-90 sm:scale-100">
             <CheckCircle2 size={12} />
             Image Selected
          </div>
        </div>
      )}

      {/* Tabs / Selectors */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-4 sm:p-6 shadow-sm space-y-6 sm:space-y-8">
           <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 border-b border-slate-50 pb-6 sm:pb-8">
              {[
                  { id: "upload", name: "Upload New", icon: <Upload size={14} /> },
                  { id: "library", name: "Local Library", icon: <Grid size={14} /> },
                  { id: "url", name: "External URL", icon: <Globe size={14} /> }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setMode(t.id as any)}
                  className={`px-6 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === t.id ? "bg-brand-forest text-white shadow-xl shadow-forest-500/20" : "bg-slate-50 text-slate-400 border border-slate-50 hover:bg-white hover:border-slate-200"}`}
                >
                  {t.icon}
                  {t.name}
                </button>
              ))}
           </div>

           <div className="min-h-[300px] animate-in fade-in duration-500 overflow-hidden">
              {mode === "upload" && (
                <div className="space-y-6">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center px-4">Upload a high-fidelity image from your device directly into Cloudinary.</p>
                  <CloudinaryUpload onUpload={handleSelect} defaultValue="" />
                </div>
              )}

              {mode === "library" && (
                <div className="space-y-6">
                   <div className="relative group max-w-md mx-auto">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-forest transition-colors" size={18} />
                      <input 
                         type="text" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder="Filter public images..." 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-xs sm:text-sm font-bold placeholder:text-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-forest/5 focus:bg-white focus:border-brand-forest/30 transition-all"
                      />
                   </div>
                   
                   {loadingLocal ? (
                      <div className="h-60 flex flex-col items-center justify-center gap-4 text-slate-300">
                         <Loader2 className="animate-spin" size={32} />
                         <p className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Assets...</p>
                      </div>
                   ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide py-2">
                         {filteredLocal.map((img, idx) => (
                            <button 
                               key={idx} 
                               onClick={() => handleSelect(img)}
                               className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${preview === img ? "border-brand-forest ring-4 ring-brand-forest/10" : "border-transparent hover:border-slate-200"}`}
                            >
                               <Image src={img} alt="Local asset" fill className="object-cover transition-transform group-hover:scale-110" />
                               <div className="absolute inset-0 bg-brand-forest/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <ImageIcon size={20} className="text-white transform scale-75 group-hover:scale-100 transition-all" />
                               </div>
                            </button>
                         ))}
                         {filteredLocal.length === 0 && (
                            <div className="col-span-full py-20 text-center text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 italic font-medium">
                               <p className="text-sm">No images match your search</p>
                            </div>
                         )}
                      </div>
                   )}
                </div>
              )}

              {mode === "url" && (
                <div className="max-w-xl mx-auto space-y-6 pt-10">
                   <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Paste Image Address</label>
                       <div className="relative group">
                          <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-orange transition-colors" />
                          <input 
                            type="url" 
                            placeholder="https://images.unsplash.com/..."
                            onKeyDown={(e) => {
                               if (e.key === 'Enter') handleSelect((e.target as HTMLInputElement).value);
                            }}
                            onBlur={(e) => {
                               if (e.target.value) handleSelect(e.target.value);
                            }}
                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 py-5 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange/30 transition-all shadow-inner"
                          />
                       </div>
                   </div>
                   <div className="flex items-center gap-3 bg-slate-900 rounded-2xl p-4 text-white">
                      <div className="h-6 w-6 rounded-full bg-brand-orange flex items-center justify-center text-[10px] font-black">!</div>
                      <p className="text-[10px] font-bold text-white/70 leading-relaxed uppercase tracking-widest">
                         Confirm external URLs to ensure responsive loading.
                      </p>
                   </div>
                </div>
              )}
           </div>
        </div>
    </div>
  );
}
