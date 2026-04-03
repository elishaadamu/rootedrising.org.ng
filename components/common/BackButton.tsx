"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();
    
    return (
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-indigo-100 hover:text-white mb-12 transition-colors group bg-transparent border-none p-0 cursor-pointer"
        >
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
            <ChevronLeft size={20} className="text-indigo-900"/>
          </div>
          <span className="font-bold tracking-wide uppercase text-indigo-900 text-xs">Go Back</span>
        </button>
    );
}
