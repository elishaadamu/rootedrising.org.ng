"use client";

import { useState, useTransition, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { 
  Save, 
  Loader2, 
  ArrowLeft, 
  Image as ImageIcon, 
  Eye, 
  Sparkles, 
  Upload, 
  Link as LinkIcon,
  X,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBlogPost } from "@/lib/actions/blog";
import { refineContent } from "@/lib/actions/chat";
import { toast } from "sonner";
import CloudinaryUpload from "./CloudinaryUpload";
import { cn } from "@/lib/utils";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const PLACEHOLDER_IMAGE = "https://blocks.astratic.com/img/general-img-landscape.png";

export default function BlogEditor({ initialData }: { initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [isPreview, setIsPreview] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [section, setSection] = useState(initialData?.section || "Story");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [createdAt, setCreatedAt] = useState(initialData?.createdAt ? new Date(initialData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSave = (isPublished: boolean = published) => {
    if (!title || !content) {
      toast.error("Required Fields Missing", {
        description: "Please provide both a title and content for your story."
      });
      return;
    }

    startTransition(async () => {
      let result;
      const postData = { 
        title, 
        excerpt, 
        content, 
        image: image || PLACEHOLDER_IMAGE,
        section,
        published: isPublished,
        createdAt,
      };

      if (initialData?.id) {
        result = await import("@/lib/actions/blog").then(m => 
            m.updateBlogPost(initialData.id, postData)
        );
      } else {
        result = await createBlogPost(postData);
      }
      
      if (result.success) {
        toast.success(initialData?.id ? "Story Updated!" : "Story Published!", {
          description: initialData?.id ? "Your changes have been saved." : "Your impact story is now live on the platform."
        });
        router.push("/admin/blog");
      } else {
        toast.error("Save Failed", {
          description: result.error || "An unexpected error occurred."
        });
      }
    });
  };

  const refineWithAI = async () => {
    if (!content && !title) {
        toast.error("Nothing to refine", { description: "Please enter some content or a title first." });
        return;
    }

    setIsAiRefining(true);
    try {
      const result = await refineContent(content, { title, excerpt, type: "blog" });
      
      if (result.success && result.text) {
        setContent(result.text);
        toast.success("Content Refined", {
          description: "AI has polished your story for maximum impact."
        });
      } else {
        throw new Error(result.error || "Failed to refine content");
      }
    } catch (error) {
      console.error("AI Refinement error:", error);
      toast.error("AI Refinement Failed", {
        description: "Could not connect to Gemini service."
      });
    } finally {
      setIsAiRefining(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setImage(url);
    setShowImageInput(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 pb-20">
      {/* Header Navigation */}
      <div className="sticky top-[72px] lg:top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md py-3 sm:py-4 border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 sticky-nav">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/admin/blog" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-forest transition-all shadow-sm shrink-0">
                <ArrowLeft size={18} />
            </Link>
            <div className="hidden xs:block">
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Editor</h2>
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Rooted Rising CMS</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
             <button 
               onClick={() => setIsPreview(!isPreview)}
               className={`flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border transition-all ${isPreview ? 'bg-brand-forest text-white border-brand-forest shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-forest'}`}
               title={isPreview ? "Exit Preview" : "Preview"}
             >
                <Eye size={16} className="shrink-0" />
                <span className="hidden md:inline">{isPreview ? "Exit Preview" : "Preview"}</span>
             </button>

             <button 
               onClick={() => setShowImageInput(!showImageInput)}
               className={`flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border transition-all ${image ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-600 border-slate-200'}`}
               title={image ? "Change Image" : "Add Cover"}
             >
                <ImageIcon size={16} className="shrink-0" />
                <span className="hidden md:inline">{image ? "Change Image" : "Add Cover"}</span>
             </button>

              <button 
                onClick={refineWithAI}
                disabled={isAiRefining}
                className="flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 transition-all disabled:opacity-50"
                title="AI Refine"
              >
                 {isAiRefining ? <Loader2 size={16} className="animate-spin shrink-0" /> : <Sparkles size={16} className="shrink-0" />}
                 <span className="hidden md:inline">AI Refine</span>
              </button>

              <button 
                onClick={() => {
                  setPublished(false);
                  handleSave(false);
                }}
                disabled={isPending}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-slate-600 border border-slate-200 hover:border-slate-300 transition-all disabled:opacity-50"
              >
                 {isPending ? <Loader2 size={16} className="animate-spin shrink-0" /> : <Save size={16} className="shrink-0" />}
                 <span>Draft</span>
              </button>

              <button 
                onClick={() => {
                  setPublished(true);
                  handleSave(true);
                }}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 sm:px-7 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black bg-brand-forest text-white shadow-xl shadow-brand-forest/10 hover:bg-brand-dark transition-all disabled:opacity-50"
              >
                 {isPending ? <Loader2 size={16} className="animate-spin shrink-0" /> : <Plus size={16} className="shrink-0" />}
                 <span>{initialData?.id ? "Update" : "Publish"}</span>
              </button>
          </div>
      </div>

      {/* Image Input Bar */}
      {showImageInput && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl animate-in fade-in slide-in-from-top-4 overflow-hidden">
           <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Configure Featured Image</h4>
              <button onClick={() => setShowImageInput(false)} className="text-slate-400 hover:text-rose-500 p-1"><X size={18} /></button>
           </div>
           <div className="grid grid-cols-1 gap-6">
              <CloudinaryUpload onUpload={handleImageUpload} defaultValue={image} />
              
              <div className="space-y-3 sm:space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400">
                     <LinkIcon size={14} className="shrink-0" />
                     <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Or Use External Image URL</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-cyan/20"
                  />
              </div>
           </div>
        </div>
      )}

      {/* Editor Main Area */}
      {isPreview ? (
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-16 shadow-sm border border-slate-100 space-y-8 sm:space-y-12 animate-in fade-in duration-500 overflow-hidden">
           <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
              <div className="relative aspect-video rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl sm:shadow-2xl">
                 <img 
                    src={image || PLACEHOLDER_IMAGE} 
                    className="w-full h-full object-cover" 
                    alt="Cover"
                 />
              </div>
              <div className="space-y-4 sm:space-y-6 text-center">
                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight lg:leading-[1.1]">{title || "Untitled Masterpiece"}</h1>
                 <p className="text-lg sm:text-xl lg:text-2xl text-slate-500 italic max-w-3xl mx-auto font-medium leading-relaxed">{excerpt}</p>
                 <div className="flex items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-50">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-brand-forest shrink-0"></div>
                    <div className="text-left">
                       <p className="text-xs sm:text-sm font-black text-slate-900">Article Preview</p>
                       <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Local Draft Only</p>
                    </div>
                 </div>
              </div>
              <div 
                className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl prose-slate max-w-none pt-8 sm:pt-10 border-t border-slate-50 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: content }}
              />
           </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-white border border-slate-100 rounded-2xl sm:rounded-3xl px-5 py-4 sm:px-8 sm:py-6">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title..."
              className="flex-1 text-xl sm:text-3xl font-black placeholder:text-slate-100 focus:outline-none transition-all"
            />
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
              <div className="flex items-center gap-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</label>
                <input 
                  type="date" 
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section</label>
              <select 
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
              >
                <option value="Articles">Articles</option>
                <option value="Poems">Poems</option>
                <option value="Campaigns">Campaigns</option>
                <option value="Story">Story</option>
              </select>
            </div>
          </div>
        </div>

          <div className="space-y-4 sm:space-y-6">
                <div className={cn(
                    "bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-3 sm:p-4 min-h-[400px] sm:min-h-[500px] shadow-sm flex flex-col transition-all",
                    isFocused ? "ring-4 ring-brand-forest/10 border-brand-forest/30" : ""
                )}>
                    <ReactQuill 
                      theme="snow" 
                      value={content} 
                      onChange={setContent}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Write your perspective here..."
                      className="flex-1 rounded-xl sm:rounded-3xl overflow-hidden border-none quill-editor-surface"
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
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-3 sm:space-y-4 shadow-sm">
                <div className="flex items-center gap-3 mb-1 sm:mb-2">
                    <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon size={14} />
                    </div>
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Short Summary / SEO Excerpt</label>
                </div>
                <textarea 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A brief summary for search results and cards..."
                  className="w-full h-24 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl px-5 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all resize-none"
                />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .quill-editor-surface .ql-container {
          border: none !important;
          font-size: 1rem;
          font-family: inherit;
        }
        @media (min-width: 640px) {
          .quill-editor-surface .ql-container {
            font-size: 1.1rem;
          }
        }
        .quill-editor-surface .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #f1f5f9 !important;
          padding: 0.75rem 1rem !important;
          background: white;
          z-index: 20;
          transition: all 0.2s ease;
        }
        
        ${isFocused ? `
          .quill-editor-surface .ql-toolbar {
            position: sticky;
            top: 144px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            border-bottom: 1px solid #e2e8f0 !important;
          }
          @media (min-width: 1024px) {
            .quill-editor-surface .ql-toolbar {
              top: 68px;
            }
          }
        ` : ''}

        @media (min-width: 640px) {
          .quill-editor-surface .ql-toolbar {
            padding: 1rem 2rem !important;
          }
        }
        .quill-editor-surface .ql-editor {
          padding: 1.5rem 1.25rem !important;
          min-height: 350px;
        }
        @media (min-width: 640px) {
          .quill-editor-surface .ql-editor {
            padding: 2.5rem 2.5rem !important;
            min-height: 450px;
          }
        }
        .prose h1 { margin-bottom: 1.5rem; font-weight: 900; color: #0f172a; font-size: 2.25rem; }
        .prose p { margin-bottom: 1.25rem; line-height: 1.7; color: #475569; }
        @media (max-width: 640px) {
          .prose h1 { font-size: 1.75rem; margin-bottom: 1rem; }
          .prose p { font-size: 0.95rem; margin-bottom: 1rem; }
        }
      `}</style>
    </div>
  );
}
