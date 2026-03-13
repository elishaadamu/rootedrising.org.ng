import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit2, Eye, Calendar, User, FileText } from "lucide-react";
import DeletePostButton from "@/components/admin/DeletePostButton";

export default async function AdminBlog() {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">Blog Stories</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Manage and publish impact stories.</p>
        </div>
        <Link 
          href="/admin/blog/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-forest px-6 py-3.5 sm:px-8 sm:py-4 text-sm font-bold text-white shadow-xl shadow-forest-500/10 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} />
          Create New Story
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post: any) => (
          <div key={post.id} className="bg-white rounded-4xl sm:rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-500">
            <div className="relative h-40 sm:h-48 overflow-hidden">
               <img 
                 src={post.image || "/images/gallery/IMG_2022.JPG"} 
                 alt={post.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               />
                <div className="absolute top-4 right-4 flex gap-2 flex-wrap justify-end">
                   {post.section && (
                     <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-brand-forest text-white shadow-lg">
                       {post.section}
                     </span>
                   )}
                   <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${post.published ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-500'} backdrop-blur-md shadow-lg border border-white/20`}>
                     {post.published ? 'Published' : 'Draft'}
                   </span>
                </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                 <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} />
                    {new Date(post.createdAt).toLocaleDateString()}
                 </div>
                 <span className="text-slate-200 hidden sm:inline">|</span>
                 <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
                    <User size={12} />
                    {post.author.name}
                 </div>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 sm:mb-4 line-clamp-2 leading-tight group-hover:text-brand-forest transition-colors">{post.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6 sm:mb-8 line-clamp-2 flex-1">{post.excerpt}</p>

              <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-slate-50">
                <div className="flex gap-2">
                   <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-brand-cyan transition-colors">
                      <Eye size={18} />
                   </Link>
                   <Link href={`/admin/blog/edit/${post.id}`} className="p-2 text-slate-400 hover:text-brand-forest transition-colors">
                      <Edit2 size={18} />
                   </Link>
                </div>
                
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="lg:col-span-3 py-16 sm:py-20 bg-white rounded-4xl sm:rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
             <FileText size={48} className="mb-4 opacity-20" />
             <p className="font-bold">No stories published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
