import prisma from "@/lib/prisma";
import { 
  MessageSquare, 
  Trash2, 
  User as UserIcon, 
  ExternalLink,
  Calendar,
  Star
} from "lucide-react";
import DeleteCommentButton from "@/components/admin/DeleteCommentButton";

import { getSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function AdminComments() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  const comments = await prisma.comment.findMany({
    include: { 
      user: true,
      post: true
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 sm:space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">Comments & Reviews</h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium">Moderate community reviews and guest perspectives.</p>
      </div>

      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[700px] sm:min-w-0">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Commenter</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">Review</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">Message</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">Target Story</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {comments.map((comment: any) => (
                <tr key={comment.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 sm:px-8 py-4 sm:py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">
                         {(comment.user?.name || comment.guestName || "?").charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate max-w-[120px] sm:max-w-none">{comment.user?.name || comment.guestName || "Guest"}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <Calendar size={10} className="shrink-0" />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                     <div className="flex gap-0.5 shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={10} className={`${s <= comment.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'} sm:size-3`} />
                        ))}
                     </div>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                     <p className="text-xs sm:text-sm text-slate-600 italic line-clamp-2 max-w-xs sm:max-w-md">"{comment.content}"</p>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                     <div className="flex items-center gap-2">
                         <p className="text-xs sm:text-sm font-bold text-brand-forest line-clamp-1 max-w-[100px] sm:max-w-none">{comment.post.title}</p>
                         <a 
                           href={`/blog/${comment.post.slug}`} 
                           target="_blank" 
                           className="p-1 text-slate-300 hover:text-brand-cyan transition-colors shrink-0"
                         >
                            <ExternalLink size={12} className="sm:size-[14px]" />
                         </a>
                      </div>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6 text-right">
                     <div className="flex items-center justify-end gap-1 sm:gap-2">
                         <a 
                           href={`/admin/comments/edit/${comment.id}`}
                           className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400 hover:text-brand-forest hover:bg-slate-50 transition-colors flex items-center justify-center rounded-lg sm:rounded-xl shrink-0"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:size-[18px]"><path d="M12 20h9"></path><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"></path></svg>
                         </a>
                         <DeleteCommentButton id={comment.id} />
                     </div>
                  </td>
                </tr>
              ))}
              {comments.length === 0 && (
                 <tr>
                    <td colSpan={5} className="py-16 sm:py-20 text-center text-slate-400 italic text-sm">No comments to moderate.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
