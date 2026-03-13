import CampaignForm from "@/components/admin/CampaignForm";
import prisma from "@/lib/prisma";
import { Mail, Clock, Users, Send } from "lucide-react";

export default async function CampaignsPage() {
  const campaigns = await (prisma as any).campaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const totalSent = campaigns.reduce((acc: number, curr: any) => acc + curr.sentCount, 0);

  return (
    <div className="space-y-8 sm:space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight leading-tight">Email Campaigns</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl">Create and send high-impact email campaigns to your newsletter subscribers using professional templates.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-emerald-50 px-5 py-3 sm:px-6 sm:py-4 rounded-2xl sm:rounded-3xl border border-emerald-100 flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Send size={18} className="sm:size-5" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-600 opacity-70 whitespace-nowrap">Total Emails Sent</p>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-none">{totalSent}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
          <h3 className="text-[11px] sm:text-sm font-black uppercase tracking-widest text-slate-400">Campaign Editor</h3>
        </div>
        <CampaignForm />
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
          <h3 className="text-[11px] sm:text-sm font-black uppercase tracking-widest text-slate-400">Recent Campaigns</h3>
        </div>
        
        <div className="bg-white rounded-3xl sm:rounded-5xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-0">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subject / Template</th>
                  <th className="px-5 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Reach</th>
                  <th className="px-5 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right whitespace-nowrap">Sent Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {campaigns.map((camp: any) => (
                  <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 sm:px-8 py-4 sm:py-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                          <Mail size={16} className="sm:size-[18px]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 truncate max-w-[150px] sm:max-w-none">{camp.subject}</p>
                          <p className="text-[9px] sm:text-[10px] text-brand-forest font-bold uppercase tracking-wider">{camp.template.replace('-', ' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 sm:px-8 py-4 sm:py-6">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Users size={14} className="text-slate-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-slate-700">{camp.sentCount} recipients</span>
                      </div>
                    </td>
                    <td className="px-5 sm:px-8 py-4 sm:py-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
                        <Clock size={12} className="shrink-0" />
                        {new Date(camp.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {campaigns.length === 0 && (
            <div className="py-16 sm:py-20 text-center">
               <p className="text-sm sm:text-base text-slate-400 font-medium italic">No campaigns sent yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
