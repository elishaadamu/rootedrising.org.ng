import prisma from "@/lib/prisma";
import { Plus, Edit2, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import DeletePamphletButton from "@/components/admin/DeletePamphletButton";

export default async function AdminPamphlets() {
  const pamphlets = await (prisma as any).pamphlet.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 sm:space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">Campaign Pamphlets</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl">Manage advocacy resources and educational materials appearing on the campaigns page.</p>
        </div>
        <Link 
          href="/admin/pamphlets/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-forest px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-forest-500/10 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add New Pamphlet
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pamphlets.map((p: any) => (
          <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-500">
            <div className="relative aspect-video overflow-hidden bg-slate-100">
               {p.image ? (
                 <img 
                   src={p.image} 
                   alt={p.title} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <FileText size={48} />
                 </div>
               )}
               <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${p.active ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-500'} backdrop-blur-md shadow-lg border border-white/20`}>
                    {p.active ? 'Active' : 'Hidden'}
                  </span>
               </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-brand-orange transition-colors">{p.title}</h3>
              <div className="text-[12px] text-slate-500 font-medium mb-6 line-clamp-2 italic opacity-80" dangerouslySetInnerHTML={{ __html: p.content || "No content provided." }}></div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                <div className="flex gap-2">
                   {p.url && (
                       <Link href={p.url} target="_blank" className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-brand-cyan hover:bg-brand-cyan/5 transition-all">
                          <ExternalLink size={18} />
                       </Link>
                   )}
                   <Link href={`/admin/pamphlets/edit/${p.id}`} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-brand-forest hover:bg-brand-forest/5 transition-all">
                      <Edit2 size={18} />
                   </Link>
                </div>
                <DeletePamphletButton id={p.id} title={p.title} />
              </div>
            </div>
          </div>
        ))}

        {pamphlets.length === 0 && (
          <div className="lg:col-span-3 py-20 bg-white rounded-4xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
             <FileText size={48} className="mb-4 opacity-20" />
             <p className="font-bold">No pamphlets added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
