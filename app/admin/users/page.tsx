import prisma from "@/lib/prisma";
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  MoreVertical,
  Activity
} from "lucide-react";
import UserRoleActions from "@/components/admin/UserRoleActions";
import { getSession } from "@/lib/actions/auth";

import { redirect } from "next/navigation";

export default async function AdminUsers() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const currentAdminId = session?.id as string;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">Ambassador Registry</h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium whitespace-pre-wrap">Manage all ambassadors and personnel accounts. You can upgrade users to <span className="text-rose-500 font-bold">Admin</span> or <span className="text-emerald-500 font-bold">Editor</span> roles.</p>
      </div>

      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-0">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">User Profile</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Assigned Role</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Registration</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg shrink-0 shadow-sm border
                        ${user.role === 'ADMIN' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          user.role === 'EDITOR' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {user.name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none hover:text-brand-forest transition-colors cursor-default">{user.name}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1.5 truncate font-medium">
                          <Mail size={12} className="shrink-0 text-slate-400" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6 text-center">
                    <span className={`px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap inline-flex items-center gap-1.5 transition-all
                      ${user.role === 'ADMIN' 
                        ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-100' 
                        : user.role === 'EDITOR'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-100'
                      }`}>
                      <ShieldCheck size={12} className={user.role === 'USER' ? 'hidden' : 'block'} />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6 text-center whitespace-nowrap">
                    <p className="text-xs sm:text-sm font-bold text-slate-600 flex items-center justify-center gap-2">
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      {new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6 text-right">
                    <UserRoleActions 
                      user={{
                        id: user.id,
                        role: user.role,
                        name: user.name
                      }} 
                      currentAdminId={currentAdminId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
