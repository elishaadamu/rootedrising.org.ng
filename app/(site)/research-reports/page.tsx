"use client";

import { motion } from "framer-motion";
import { FileText, Download, Calendar, User, Search } from "lucide-react";
import Image from "next/image";

const reports = [
  {
    id: 1,
    title: "Regional Climate Impact Assessment 2024",
    excerpt: "A comprehensive analysis of localized climate patterns and their socio-economic impacts on rural agricultural communities.",
    date: "March 2024",
    author: "Research Team",
    category: "Climate Resilience",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Sustainable Energy Adoption in Rural Nigeria",
    excerpt: "Evaluating the barriers and opportunities for off-grid clean energy solutions in remote underserved regions.",
    date: "January 2024",
    author: "Impact Analytics",
    category: "Clean Energy",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Youth-Led Innovation for Ecosystem Restoration",
    excerpt: "Showcasing data-driven approaches by young leaders in restoring degraded landscapes and preserving biodiversity.",
    date: "November 2023",
    author: "Global Leadership Lab",
    category: "Ecosystems",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvHFYTWM3JspgG9sWCsQLjvVf7Q0EutrhBbw&s",
  }
];

export default function ResearchReportsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 mb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-none mb-6">
                Evidence-Based <br />
                <span className="text-brand-forest">Insights</span>
              </h1>
              <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10">
                Our research wing translates complex environmental data into actionable insights, empowering communities with the knowledge to build a sustainable future.
              </p>
              
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search reports, topics, or keywords..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-brand-forest/5 focus:border-brand-forest outline-none transition-all shadow-sm"
                />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -z-10 opacity-10">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="200" r="200" fill="url(#paint0_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="200" y1="0" x2="600" y2="400" gradientUnits="userSpaceOnUse">
                <stop stopColor="#059669" />
                <stop offset="1" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <FileText className="text-brand-cyan" size={28} />
              Featured publications
            </h2>
            <div className="flex gap-4">
              <span className="px-5 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer hover:bg-slate-200 transition-colors uppercase tracking-widest">All</span>
              <span className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-bold cursor-pointer hover:border-brand-forest hover:text-brand-forest transition-colors uppercase tracking-widest">Reports</span>
              <span className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-bold cursor-pointer hover:border-brand-forest hover:text-brand-forest transition-colors uppercase tracking-widest">Data</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={report.image} 
                    alt={report.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md text-brand-forest text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                      {report.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-10">
                  <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {report.date}</span>
                    <span className="flex items-center gap-1.5"><User size={12} /> {report.author}</span>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-brand-forest transition-colors">
                    {report.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                    {report.excerpt}
                  </p>
                  
                  <button className="flex items-center gap-2 text-brand-cyan text-sm font-black uppercase tracking-widest group/btn border-t border-slate-50 pt-6 w-full hover:text-brand-forest transition-colors">
                    Download Report <Download size={16} className="transition-transform group-hover/btn:translate-y-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 mt-32">
        <div className="bg-brand-forest rounded-[4rem] p-12 lg:p-24 relative overflow-hidden text-center text-white">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-none mb-8">Receive our Weekly <br />Impact Reports</h2>
            <p className="text-white/80 text-lg font-medium mb-12">
              Get the latest research and data-driven insights delivered straight to your inbox every Monday.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your work email"
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:bg-white/20 transition-all text-white placeholder:text-white/40 font-bold"
              />
              <button className="bg-white text-brand-forest px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-colors">
                Join Network
              </button>
            </div>
          </div>
          
          {/* Abstract decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="1200" height="600" fill="url(#paint_grad)" />
              <defs>
                <radialGradient id="paint_grad" cx="600" cy="300" r="400" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>
    </main>
  );
}
