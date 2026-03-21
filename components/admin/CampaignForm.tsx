"use client";

import { useState, useTransition } from "react";
import { sendCampaign } from "@/lib/actions/newsletter";
import { campaignTemplates } from "@/lib/constants/templates";
import { Send, Layout, Type, AlignLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CampaignForm() {
  const initialTemplate = campaignTemplates && campaignTemplates.length > 0 ? campaignTemplates[0] : { id: "", name: "", subject: "", content: "" };
  
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [subject, setSubject] = useState(initialTemplate.subject);
  const [content, setContent] = useState(initialTemplate.content);
  const [isPending, startTransition] = useTransition();

  const handleTemplateChange = (template: typeof campaignTemplates[0]) => {
    setSelectedTemplate(template);
    setSubject(template.subject);
    setContent(template.content);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirm(`Are you sure you want to send this campaign to all subscribers?`)) return;

    const formData = new FormData();
    formData.append("templateId", selectedTemplate.id);
    formData.append("subject", subject);
    formData.append("content", content);

    startTransition(async () => {
      const result = await sendCampaign(formData);
      if (result.success) {
        toast.success(`Success! Campaign sent to ${result.sentCount} subscribers.`);
      } else {
        toast.error(result.error || "Failed to send campaign");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
      {/* Left Column: Template Selection */}
      <div className="lg:col-span-1 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center shrink-0">
              <Layout size={18} className="sm:size-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">Choose Template</h3>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {campaignTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateChange(template)}
                className={cn(
                  "w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex flex-col gap-1",
                  selectedTemplate.id === template.id
                    ? "bg-brand-forest/5 border-brand-forest/30 ring-1 ring-brand-forest/30"
                    : "bg-white border-slate-100 hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs sm:text-sm font-bold", selectedTemplate.id === template.id ? "text-brand-forest" : "text-slate-900")}>
                    {template.name}
                  </span>
                  {selectedTemplate.id === template.id && <CheckCircle2 size={14} className="text-brand-forest sm:size-4" />}
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">{template.subject}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex gap-3 sm:gap-4">
          <AlertCircle className="text-amber-500 shrink-0" size={18} />
          <p className="text-[11px] sm:text-xs text-amber-900 font-medium leading-relaxed">
            Sending a campaign will email all active newsletter subscribers immediately. Please review your content carefully.
          </p>
        </div>
      </div>

      {/* Right Column: Editor & Preview */}
      <div className="lg:col-span-2 space-y-6 sm:space-y-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-slate-100 space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                <Type size={12} /> Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject line"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-forest/10 focus:border-brand-forest transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                <AlignLeft size={12} /> Message Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Compose your message..."
                rows={10}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-4 sm:py-6 text-sm sm:text-base font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-forest/10 focus:border-brand-forest transition-all resize-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
             <div className="flex items-center gap-2 order-2 sm:order-1">
                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-slate-500 shrink-0">i</div>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium italic text-center sm:text-left">Email will include Rooted Rising brand footer automatically.</span>
             </div>
             <button
              type="submit"
              disabled={isPending || !subject || !content}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-forest text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base shadow-xl hover:bg-brand-dark transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shrink-0 order-1 sm:order-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Sending...
                </>
              ) : (
                <>
                  Launch Campaign <Send size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <div className="bg-slate-50 rounded-3xl sm:rounded-[2.5rem] p-1 sm:p-2 border border-slate-100">
           <div className="bg-white rounded-[1.2rem] sm:rounded-3xl p-4 sm:p-8 shadow-sm">
              <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6 sm:mb-8 text-center">— Mobile Preview —</h4>
              <div className="max-w-md mx-auto border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-white shadow-inner">
                <div className="text-center mb-6 sm:mb-10">
                  <h2 className="text-xl sm:text-2xl font-black text-brand-forest m-0 leading-tight">Rooted Rising Initiative</h2>
                  <p className="uppercase text-[7px] sm:text-[8px] tracking-widest font-black text-slate-400 mt-1">Rooted in Truth, Rising for Justice</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-relaxed line-clamp-2">
                    {content ? content.split('\n')[0] : "Email body content starts here..."}
                  </p>
                  <div className="space-y-2">
                    {content.split('\n').filter(l => l.trim()).slice(1, 4).map((line, i) => (
                      <p key={i} className="text-[9px] sm:text-[10px] text-slate-600 leading-relaxed line-clamp-2">{line}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-50 text-center">
                  <div className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-brand-forest rounded-lg sm:rounded-xl text-white font-black text-[9px] sm:text-[10px]">Read More on Blog</div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
