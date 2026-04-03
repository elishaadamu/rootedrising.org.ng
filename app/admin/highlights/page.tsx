import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit2, Calendar, User, FileText, Send } from "lucide-react";
import DeletePostButton from "@/components/admin/DeletePostButton";
import SyncMarkdownButton from "@/components/admin/SyncMarkdownButton";

export default async function AdminHighlights() {
  const posts = await prisma.post.findMany({
    where: { 
      section: { 
        in: ["Campaigns", "Campaign", "campaign"],
        mode: "insensitive" 
      } 
    },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 sm:space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">Campaign Highlights</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl">Manage your advocacy reports, impact stories, and deep dives appearing on the campaigns page.</p>
        </div>
        <Link 
          href="/admin/highlights/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-forest px-8 py-4 text-sm font-black text-white shadow-xl shadow-forest-500/10 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} />
          Create New Highlight
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {posts.map((post: any) => (
          <div key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-500">
            <div className="relative h-48 sm:h-56 overflow-hidden">
               <img 
                 src={post.image || "/images/placeholder.png"} 
                 alt={post.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               />
                <div className="absolute top-4 right-4 flex gap-2 flex-wrap justify-end">
                   <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-brand-orange text-white shadow-lg border border-brand-orange/20">
                     Featured
                   </span>
                   <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${post.published ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-500'} backdrop-blur-md shadow-lg border border-white/20`}>
                     {post.published ? 'Published' : 'Draft'}
                   </span>
                </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} className="text-slate-300" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                 </div>
                 <span className="text-slate-100 font-thin">|</span>
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
                    <User size={12} className="text-brand-cyan/40" />
                    {post.author.name}
                 </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-4 truncate group-hover:text-brand-orange transition-colors leading-tight">{post.title}</h3>
              <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-8 leading-relaxed italic opacity-80">{post.excerpt || "No summary provided."}</p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                <div className="flex gap-2">
                   <Link href={`/admin/highlights/edit/${post.id}`} className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-brand-forest hover:bg-brand-forest/5 transition-all">
                      <Edit2 size={18} />
                   </Link>
                </div>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="lg:col-span-3 py-24 bg-white rounded-5xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
             <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <Send size={40} className="text-slate-100" />
             </div>
             <p className="font-black text-xs uppercase tracking-[0.3em]">No highlights published</p>
          </div>
        )}
      </div>
    </div>
  );
}
