import AIPromptEditor from "@/components/admin/AIPromptEditor";
import { Bot, Sparkles, Brain } from "lucide-react";

export default function AIAdminPage() {
  return (
    <div className="space-y-12 animate-fade-in font-outfit">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-slate-100">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange shadow-inner">
             <Brain size={24} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 md:text-5xl lg:text-6xl tracking-tight mb-4 uppercase">AI Command Center</h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Customize the "intelligence" behind Rooted Rising. Modify the prompts that guide the chatbot, blog refiner, and bio generator.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-brand-cyan/5 blur-3xl opacity-50"></div>
         <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-brand-forest/5 blur-3xl opacity-50"></div>
         
         <div className="relative z-10 max-w-7xl mx-auto">
            <AIPromptEditor />
         </div>
      </div>
    </div>
  );
}
