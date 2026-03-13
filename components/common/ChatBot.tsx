"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Info, Bot } from "lucide-react";
import { generateChatResponse } from "@/lib/actions/chat";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    {
      label: "What is Rooted Rising?",
      userPrompt: "What is the Rooted Rising Initiative?",
      botResponse: "Rooted Rising is a dynamic media advocacy initiative, harnessing the power of storytelling, art, and grassroots activism to ignite climate action and gender equality. We are Rooted in Truth, Rising for Justice."
    },
    {
      label: "Read Impact Stories",
      userPrompt: "Where can I read your impact stories?",
      botResponse: "You can find all our latest articles, news, and impact stories from the field on our Blog page. Navigate to /blog to read them!"
    },
    {
      label: "Visual Impact Gallery",
      userPrompt: "Where can I see photos of your work?",
      botResponse: "We have a dedicated photo gallery showcasing our visual impact and moments of co-creation. You can view it by navigating to /gallery."
    }
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleActionClick = (prompt: string, response: string) => {
    setMessages([
      { role: "user", text: prompt },
      { role: "bot", text: response }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI
    const newMessages = [...messages, { role: "user" as const, text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Format history for Gemini API
      const history = newMessages.slice(0, -1).map(msg => ({
        role: msg.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: msg.text }]
      }));

      const result = await generateChatResponse(history, userMessage);

      if (result.success && result.text) {
        setMessages(prev => [...prev, { role: "bot", text: result.text }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: "I'm sorry, I'm having trouble connecting right now." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: "An error occurred. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-forest text-white shadow-2xl flex items-center justify-center transition-all hover:bg-brand-dark hover:scale-110 active:scale-95 z-9999 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <Bot size={24} />
      </button>

      <div 
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-4xl shadow-2xl border border-slate-100 flex flex-col z-9999 transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-brand-forest text-white p-5 rounded-t-4xl flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-brand-forest to-brand-teal opacity-50"></div>
          <div className="relative z-10 flex items-center gap-3">
             <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                <Bot size={20} className="text-white" />
             </div>
             <div>
                <h3 className="font-black text-sm">Rooted Rising Assistant</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/90">Powered by Gemini AI</p>
             </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            aria-label="Close Assistant"
            className="relative z-10 h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in slide-in-from-bottom-4">
               <div className="space-y-2 px-6">
                  <h4 className="font-black text-slate-900">Welcome to Rooted Rising!</h4>
                  <p className="text-sm font-medium text-slate-500">I'm your AI advocate. How can I help you support our mission today?</p>
               </div>
               <div className="flex flex-col gap-2 w-full mt-4 px-4 overflow-y-auto max-h-[220px] pb-2">
                 {quickActions.map((action, idx) => (
                   <button 
                      key={idx}
                      onClick={() => handleActionClick(action.userPrompt, action.botResponse)}
                      className="w-full shrink-0 flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-brand-forest hover:text-brand-forest shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                   >
                     <span className="text-amber-500 text-lg leading-none">⚡</span>
                     <span className="truncate">{action.label}</span>
                   </button>
                 ))}
               </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl p-4 text-sm font-medium shadow-sm leading-relaxed ${
                      msg.role === "user" 
                        ? 'bg-brand-forest text-white rounded-tr-sm' 
                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm p-4 bg-white border border-slate-100 shadow-sm flex items-center gap-2">
                     <Loader2 size={16} className="animate-spin text-brand-forest" />
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thinking</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 rounded-b-4xl">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 mb-3"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send Message"
              className="h-11 w-11 rounded-xl bg-brand-forest text-white flex items-center justify-center hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 bg-emerald-50/80 py-2.5 rounded-xl border border-emerald-100">
             <span>Need human help?</span>
             <a 
               href="https://wa.me/2347068212022" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-emerald-700 font-bold hover:text-emerald-800 transition-all flex items-center gap-1.5 bg-white px-2 py-1 rounded-md shadow-sm border border-emerald-200 hover:shadow-md"
             >
               <MessageCircle size={14} className="fill-emerald-500 text-emerald-500" /> Chat on WhatsApp
             </a>
          </div>
        </div>
      </div>
    </>
  );
}
