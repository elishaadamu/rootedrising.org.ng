"use client";

import { useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  defaultValue?: string;
}

export default function CloudinaryUpload({ onUpload, defaultValue }: CloudinaryUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(defaultValue || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File too large", { description: "Maximum size is 5MB" });
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      uploadFile(selectedFile);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ireact_preset"); // User needs to set this up or I provide a generic one if using signed uploads

    try {
      // For simplicity in this demo, we'll use a server action if we have one, 
      // but client-side unsigned upload is easiest for quick setup if the user has a preset.
      // However, the user asked to "use cloudinary", usually implying server-side logic in an "agent" context.
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        onUpload(data.url);
        setPreview(data.url);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed", { description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 group">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             <button 
               onClick={() => { setFile(null); setPreview(""); onUpload(""); }}
               className="h-10 w-10 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
             >
                <X size={20} />
             </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
               <Loader2 className="animate-spin text-brand-forest" size={32} />
               <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Uploading to Cloudinary</p>
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 hover:border-brand-cyan transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-3">
            <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-brand-cyan group-hover:bg-white transition-all shadow-sm">
              <Upload size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">PNG, JPG or WebP (MAX. 5MB)</p>
            </div>
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
      )}
    </div>
  );
}
