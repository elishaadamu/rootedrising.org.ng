"use client";

import { useEffect, useState } from "react";
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { toast } from "sonner";

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/blog/${slug}`);
  }, [slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!url) return null;

  return (
    <div className="flex items-center gap-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2 hidden sm:block">Share</p>
      
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all"
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
      </a>
      
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all"
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
      </a>
      
      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#0A66C2] hover:text-white transition-all"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </a>

      <div className="w-px h-6 bg-slate-200 mx-1"></div>

      <button 
        onClick={handleCopy}
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-brand-forest hover:text-white transition-all"
        aria-label="Copy Link"
      >
        {copied ? <Check size={18} /> : <Link2 size={18} />}
      </button>
    </div>
  );
}
