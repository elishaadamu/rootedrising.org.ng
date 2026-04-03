import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Play, Edit2 } from "lucide-react";
import DeleteVideoButton from "@/components/admin/DeleteVideoButton";


export default async function AdminVideos() {
  const videos = await (prisma as any).video.findMany({
    orderBy: { order: "asc" },
  });


  return (
    <div className="space-y-8 sm:space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight leading-tight">Campaign Videos</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl">Manage the videos showcased in the "Voice of the Frontline" section.</p>
        </div>
        
        <Link 
          href="/admin/videos/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-forest px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-forest-500/10 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add New Video
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video: any) => (
          <div key={video.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-500">
            <div className="relative aspect-video overflow-hidden bg-slate-100">
               <img 
                 src={`https://img.youtube.com/vi/${video.url.match(/(?:embed\/|v=|\/v\/|youtu\.be\/|\/embed\/|\/watch\?v=|\?v=)([^#\&\?]*)/)?.[1] || ''}/hqdefault.jpg`}
                 alt={video.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               />
               <div className="absolute inset-0 bg-brand-dark/20 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                     <Play size={20} fill="currentColor" />
                  </div>
               </div>
               <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${video.active ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-500'} backdrop-blur-md shadow-lg border border-white/20`}>
                    {video.active ? 'Active' : 'Hidden'}
                  </span>
               </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors leading-tight min-h-[56px] flex items-center">{video.title}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 truncate">{video.url}</p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                <div className="flex gap-2">
                   <Link href={`/admin/videos/edit/${video.id}`} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-brand-forest hover:bg-brand-forest/5 transition-all">
                      <Edit2 size={18} />
                   </Link>
                </div>
                <DeleteVideoButton id={video.id} title={video.title} />
              </div>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="lg:col-span-3 py-20 bg-white rounded-4xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
             <Play size={48} className="mb-4 opacity-20" />
             <p className="font-bold">No videos linked yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
