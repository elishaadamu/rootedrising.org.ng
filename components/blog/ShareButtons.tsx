"use client";

import { useEffect, useState } from "react";
import { Facebook, Twitter, Linkedin, Link2, Check, Instagram } from "lucide-react";
import { toast } from "sonner";

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
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
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-black hover:text-white transition-all"
        aria-label="Share on X"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
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
      
      <a 
        href="https://www.instagram.com/rootedrising1/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:text-white transition-all"
        aria-label="Follow on Instagram"
      >
        <Instagram size={18} />
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
