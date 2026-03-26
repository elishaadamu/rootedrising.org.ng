"use client";

import { useState, useEffect } from "react";
import { getAllAISettings, updateAISetting } from "@/lib/actions/ai-settings";
import { Save, Loader2, Bot, FileText, Sparkles, User, HelpCircle } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_PROMPTS: Record<string, string> = {
  chat: `You are the AI Assistant for the Rooted Rising Initiative.
Rooted Rising is a dynamic media advocacy initiative that harnesses the power of storytelling, art, and grassroots activism to ignite climate action and gender equality.
Our motto is: "Rooted in Truth, Rising for Justice."

Key Focus Areas:
1. Gender Justice: Amplifying voices of women and marginalized genders.
2. Environment Justice: Advocating for communities in oil-sacrificed zones and demanding accountability from polluters.
3. Society: Empowering communities to challenge systemic injustices.

Methodology:
- Storytelling: Capturing human resilience.
- Content Creation: Producing high-impact digital media.
- Artistic Impact: Using visual and performance arts.

Contact Information:
- Email: info@rootedrising.org.ng
- Phone/WhatsApp: +234 (0) 706 821 2022

You help users understand our mission, methodology, and how to get involved. Be professional, inspiring, and helpful.

IMPORTANT INSTRUCTIONS: 
1. DO NOT use markdown formatting (no bolding, italics, or lists with asterisks). Respond ONLY in plain, conversational text.
2. If the user asks how to find things on the website, use these paths:
- Home: /
- About: /about
- Blog / Impact Stories: /blog
- Gallery / Visual Impact: /gallery
- Campaigns / Voice of the Frontline: /campaigns
- Opportunities / Volunteer: /opportunities
- Contact: /contact
- Dashboard/Admin: /admin`,
  blog: `Refine this blog post content for the Rooted Rising Initiative. 
Make it professional, engaging, and impactful. The initiative focuses on climate action and gender equality through storytelling, art, and grassroots activism.
Return the refined content in HTML format suitable for a blog post.
Title: {title}
Excerpt: {excerpt}
Current Content: {content}`,
  highlight: `Refine this campaign highlight content for the Rooted Rising Initiative. 
Make it professional, engaging, and impactful. The initiative focuses on climate action and gender equality through storytelling, art, and grassroots activism.
Return the refined content in HTML format suitable for a blog post.
Title: {title}
Excerpt: {excerpt}
Current Content: {content}`,
  bio: `Refine this professional bio for a team member of the Rooted Rising Initiative.
Team Member: {title} ({excerpt})
Current Bio: {content}
Task: Make it more engaging, professional, and impactful. 
CRITICAL: Return ONLY plain text. NO markdown, NO hashtags.`
};

const PROMPT_TYPES = [
  { key: "chat", label: "Chatbot Persona", icon: <Bot size={20} />, description: "Controls how the AI responds to users in the support chat." },
  { key: "blog", label: "Blog Refiner", icon: <FileText size={20} />, description: "Used to refine and clean up blog post content." },
  { key: "highlight", label: "Highlight Refiner", icon: <Sparkles size={20} />, description: "Used to refine campaign highlights and snippets." },
  { key: "bio", label: "Bio Generator", icon: <User size={20} />, description: "Used to generate or refine team member biographies." },
];

export default function AIPromptEditor() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const result = await getAllAISettings();
      if (result.success && result.data) {
        const mapped = result.data.reduce((acc: any, curr: any) => {
          acc[curr.key] = curr.prompt;
          return acc;
        }, {});
        
        // Merge with defaults for keys that don't exist yet
        const initialSettings = { ...DEFAULT_PROMPTS, ...mapped };
        setSettings(initialSettings);
      } else {
        setSettings(DEFAULT_PROMPTS);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (key: string) => {
    setSavingKey(key);
    const result = await updateAISetting(key, settings[key] || "");
    if (result.success) {
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} prompt updated.`);
    } else {
      toast.error(`Failed to update ${key}: ${result.error}`);
    }
    setSavingKey(null);
  };

  const restoreDefault = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: DEFAULT_PROMPTS[key] }));
    toast.info("Default prompt restored. Don't forget to save!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-brand-orange" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex gap-4 text-amber-800">
         <HelpCircle className="shrink-0 mt-1" />
         <div className="text-sm space-y-2">
            <p className="font-bold uppercase tracking-widest text-[10px]">How it works</p>
            <p className="font-medium leading-relaxed">
              These prompts tell the AI how to behave. You can use placeholders like <code className="bg-amber-100 px-1 rounded">{"{title}"}</code>, <code className="bg-amber-100 px-1 rounded">{"{excerpt}"}</code>, and <code className="bg-amber-100 px-1 rounded">{"{content}"}</code> for content refinement. For the chatbot, just provide the persona and instructions.
            </p>
         </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {PROMPT_TYPES.map((type) => (
          <div key={type.key} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-orange shadow-inner">
                     {type.icon}
                  </div>
                  <div>
                     <h3 className="font-black text-slate-900 tracking-tight">{type.label}</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{type.key} prompt</p>
                  </div>
               </div>
               <button 
                onClick={() => restoreDefault(type.key)}
                className="p-2 text-slate-400 hover:text-brand-orange transition-colors"
                title="Restore Default"
               >
                  <Sparkles size={18} />
               </button>
            </div>
            
            <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">
              {type.description}
            </p>

            <div className="flex-1">
               <textarea
                 value={settings[type.key] || ""}
                 onChange={(e) => setSettings({ ...settings, [type.key]: e.target.value })}
                 className="w-full h-64 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium text-slate-700 outline-none focus:border-brand-orange focus:bg-white transition-all resize-none shadow-inner"
                 placeholder={`Enter custom instructions for ${type.label}...`}
               />
            </div>

            <div className="mt-8 flex justify-end">
               <button
                 onClick={() => handleSave(type.key)}
                 disabled={savingKey === type.key}
                 className="flex items-center gap-2 px-8 py-3 bg-brand-navy text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-orange transition-all shadow-lg active:scale-95 disabled:opacity-50"
               >
                 {savingKey === type.key ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                 Save Changes
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
