"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { 
  Save, 
  Loader2, 
  ArrowLeft, 
  Sparkles, 
  Globe, 
  Calendar,
  Eye, 
  Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog";
import { refineContent } from "@/lib/actions/chat";
import { toast } from "sonner";
import ImageSelector from "./ImageSelector";
import { cn } from "@/lib/utils";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function HighlightEditor({ initialData }: { initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [image, setImage] = useState(initialData?.image || "/images/placeholder.png");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [createdAt, setCreatedAt] = useState(initialData?.createdAt ? new Date(initialData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isPreview, setIsPreview] = useState(false);
  const router = useRouter();

  const handleSave = (status: boolean = published) => {
    if (!title || !content) {
      toast.error("Required Fields Missing", {
        description: "Please provide both a title and the main content."
      });
      return;
    }

    startTransition(async () => {
      const data = { title, excerpt, content, image, section: "Campaigns", published: status, createdAt };
      const res = initialData?.id 
        ? await updateBlogPost(initialData.id, data)
        : await createBlogPost(data);

      if (res.success) {
        toast.success(initialData?.id ? "Highlight Updated" : "Highlight Created!");
        router.push("/admin/highlights");
        router.refresh();
      } else {
        toast.error("Error: " + res.error);
      }
    });
  };

  const refineWithAI = async () => {
    if (!content) return toast.error("Enter some content first");
    setIsAiRefining(true);
    try {
      const result = await refineContent(content, { title, excerpt, type: "highlight" });
      
      if (result.success && result.text) {
        setContent(result.text);
        toast.success("AI Polished!");
      } else {
        throw new Error(result.error || "Failed to refine content");
      }
    } catch (error) {
       console.error("AI Refinement error:", error);
       toast.error("AI Refinement Error");
    } finally {
      setIsAiRefining(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24">
      {/* Dynamic Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <Link 
            href="/admin/highlights" 
            className="group flex items-center gap-2 text-slate-400 hover:text-brand-orange transition-all mb-4 font-bold text-sm tracking-tight"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Highlights
          </Link>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {initialData ? "Edit Highlight" : "Create Highlight"}
          </h2>
          <p className="text-slate-500 font-medium">Drafting advocacy deep-dives and campaign reports.</p>
        </div>

        <div className="flex items-center gap-3">
           <button
             onClick={() => setIsPreview(!isPreview)}
             className={`p-4 rounded-2xl border transition-all ${isPreview ? 'bg-brand-orange text-white border-brand-orange shadow-lg' : 'bg-white text-slate-400 border-slate-100'}`}
           >
              <Eye size={22} />
           </button>
           <button
             onClick={() => handleSave(true)}
             disabled={isPending}
             className="flex items-center justify-center gap-2 rounded-2xl bg-brand-forest px-8 py-4 text-sm font-black text-white shadow-xl shadow-forest-500/20 hover:bg-brand-dark transition-all active:scale-95 disabled:opacity-50"
           >
             {isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
             {initialData ? "Update Story" : "Publish to Site"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
           {isPreview ? (
             <section className="bg-white rounded-[2.5rem] p-12 lg:p-16 border border-slate-100 shadow-sm animate-in fade-in duration-500 overflow-hidden prose prose-slate max-w-none">
                <header className="mb-12 text-center not-prose">
                   <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange mb-6">
                      <Calendar size={12} />
                      Featured Highlight • Real-time Preview
                   </div>
                   <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-8 leading-tight">{title || "Untitled Story"}</h1>
                   <p className="text-xl text-slate-500 italic font-medium leading-relaxed max-w-3xl mx-auto">{excerpt}</p>
                </header>
                <div 
                   className="pt-12 border-t border-slate-100"
                   dangerouslySetInnerHTML={{ __html: content }}
                />
             </section>
           ) : (
             <>
               <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
                  <div className="space-y-6">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title of Highlight Story..."
                      className="w-full text-3xl font-black placeholder:text-slate-100 focus:outline-none focus:placeholder:opacity-50 transition-all border-b border-transparent focus:border-slate-50 pb-4"
                    />
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Brief excerpt for card display..."
                      rows={2}
                      className="w-full bg-slate-50 rounded-2xl p-6 text-sm sm:text-base font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-brand-forest/5 transition-all resize-none"
                    />
                  </div>
               </section>

               <section className="bg-white rounded-[2.5rem] p-4 sm:p-10 border border-slate-100 shadow-sm min-h-[500px] flex flex-col relative group">
                  <div className="absolute top-6 right-6 z-10">
                     <button
                       onClick={refineWithAI}
                       disabled={isAiRefining}
                       className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 text-amber-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-amber-100 hover:bg-amber-100 transition-all disabled:opacity-50 shadow-sm"
                     >
                        {isAiRefining ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        Refine with AI
                     </button>
                  </div>
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent}
                    placeholder="Deep dive into the campaign details here..."
                    className="flex-1 quill-editor-surface"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        ['link', 'image', 'video'],
                        ['clean']
                      ],
                    }}
                  />
               </section>
             </>
           )}
        </div>

        <div className="lg:col-span-2 space-y-10">
           <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-xl bg-orange-100 flex items-center justify-center text-brand-orange shadow-sm">
                    <Globe size={18} />
                 </div>
                 <h3 className="text-lg font-black text-slate-900">Featured Image</h3>
              </div>
              
              <ImageSelector 
                 defaultValue={image}
                 onSelect={setImage}
              />
           </div>

           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-8">
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-1">Post Date</p>
                 <input 
                   type="date" 
                   value={createdAt}
                   onChange={(e) => setCreatedAt(e.target.value)}
                   className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-brand-orange/20 transition-all cursor-pointer"
                 />
              </div>
              
              <div className="h-px bg-white/10 w-full"></div>

              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-1">Article Status</p>
                    <p className="text-xl font-black">{published ? "Public Highlight" : "Draft Mode"}</p>
                 </div>
                 <button
                    onClick={() => setPublished(!published)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${published ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${published ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
              </div>
              <div className="h-px bg-white/10 w-full"></div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                 Settings applied to <span className="text-white">Campaign Highlights</span> section of the public page.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
