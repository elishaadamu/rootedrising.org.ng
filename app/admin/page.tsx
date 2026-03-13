import prisma from "@/lib/prisma";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  ArrowUpRight,
  Mail 
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const userCount = await (prisma as any).user.count();
  const postCount = await (prisma as any).post.count();
  const commentCount = await (prisma as any).comment.count();
  const subscriberCount = await (prisma as any).newsletter.count();

  const stats = [
    { name: "Total Users", value: userCount, icon: <Users />, color: "bg-blue-50 text-blue-600" },
    { name: "Blog Posts", value: postCount, icon: <FileText />, color: "bg-emerald-50 text-emerald-600" },
    { name: "Newsletter", value: subscriberCount, icon: <Mail />, color: "bg-purple-50 text-purple-600" },
    { name: "Comments", value: commentCount, icon: <MessageSquare />, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 sm:gap-6">
            <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.name}</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* Recent Subscribers */}
        <div className="bg-white rounded-3xl sm:rounded-5xl p-6 sm:p-8 shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">Recent Subscribers</h3>
              <Link href="/admin/subscribers" className="text-xs sm:text-sm font-bold text-brand-forest hover:underline">View All</Link>
           </div>
           
           <div className="space-y-3 sm:space-y-4">
              {(await (prisma as any).newsletter.findMany({ take: 5, orderBy: { createdAt: 'desc' } })).map((sub: any) => (
                <div key={sub.id} className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                         <Mail size={14} className="sm:size-4" />
                      </div>
                      <div className="min-w-0">
                         <p className="text-sm font-bold text-slate-900 truncate">{sub.email}</p>
                         <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium whitespace-nowrap">Joined {new Date(sub.createdAt).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0"></div>
                </div>
              ))}
              {subscriberCount === 0 && (
                <div className="py-8 sm:py-10 text-center text-slate-400 italic text-sm">No subscribers yet.</div>
              )}
           </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-white rounded-3xl sm:rounded-5xl p-6 sm:p-8 shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">Recent Comments</h3>
              <Link href="/admin/comments" className="text-xs sm:text-sm font-bold text-brand-forest hover:underline">View All</Link>
           </div>
           
           <div className="space-y-3 sm:space-y-4">
              {(await (prisma as any).comment.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: true } })).map((comment: any) => (
                <div key={comment.id} className="flex flex-col gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-brand-cyan truncate max-w-[150px]">{comment.user?.name || comment.guestName}</span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 whitespace-nowrap">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                   </div>
                   <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 italic">"{comment.content}"</p>
                </div>
              ))}
              {commentCount === 0 && (
                <div className="py-8 sm:py-10 text-center text-slate-400 italic text-sm">No comments yet.</div>
              )}
           </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-3xl sm:rounded-5xl p-6 sm:p-8 shadow-sm border border-slate-100">
         <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">Recent Ambassadors</h3>
            <Link href="/admin/users" className="text-xs sm:text-sm font-bold text-brand-forest hover:underline">View All</Link>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(await (prisma as any).user.findMany({ take: 6, orderBy: { createdAt: 'desc' } })).map((user: any) => (
              <div key={user.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                 <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-base sm:text-lg shrink-0">
                    {user.name?.charAt(0)}
                 </div>
                 <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
