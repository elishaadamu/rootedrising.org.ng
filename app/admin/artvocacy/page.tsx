import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Play, Edit2, Trash2, ArrowLeft } from "lucide-react";
import DeleteArtvocacyButton from "@/components/admin/DeleteArtvocacyButton";

export default async function AdminArtvocacy() {
  const artItems = await (prisma as any).artvocacy.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Artvocacy Highlights</h2>
          <p className="text-slate-500 font-medium max-w-xl">Manage the featured videos in the Artvocacy section of the campaigns page.</p>
        </div>
        <Link 
          href="/admin/artvocacy/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-forest px-8 py-4 text-sm font-black text-white shadow-xl shadow-forest-500/10 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add New Highlight
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artItems.map((item: any) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-500">
            <div className="relative aspect-video overflow-hidden bg-slate-100">
               <img 
                 src={`https://img.youtube.com/vi/${item.url.match(/(?:embed\/|v=|\/v\/|youtu\.be\/|\/embed\/|\/watch\?v=|\?v=)([^#\&\?]*)/)?.[1] || ''}/hqdefault.jpg`}
                 alt={item.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               />
               <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${item.active ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-500'} backdrop-blur-md shadow-lg border border-white/20`}>
                    {item.active ? 'Active Highlight' : 'Hidden'}
                  </span>
               </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-brand-orange transition-colors">{item.title}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 truncate">{item.url}</p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                <div className="flex gap-2">
                   <Link href={`/admin/artvocacy/edit/${item.id}`} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-brand-forest hover:bg-brand-forest/5 transition-all">
                      <Edit2 size={18} />
                   </Link>
                </div>
                <DeleteArtvocacyButton id={item.id} title={item.title} />
              </div>
            </div>
          </div>
        ))}
        {artItems.length === 0 && (
          <div className="lg:col-span-3 py-20 bg-white rounded-4xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
             <Play size={48} className="mb-4 opacity-20" />
             <p className="font-bold">No highlights yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
