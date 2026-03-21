"use client";

import { useEffect, useState } from "react";
import { getActivityLogs } from "@/lib/actions/logs";
import { 
  ClipboardList, 
  Calendar, 
  User as UserIcon, 
  Activity,
  ChevronRight,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { getSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    const result = await getActivityLogs();
    if (result.success) {
      setLogs(result.data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    async function checkAuth() {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            redirect("/admin");
        } else {
            setIsAuthorized(true);
            fetchLogs();
        }
    }
    checkAuth();
  }, []);

  if (isAuthorized === null) return null;

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATED": return "text-emerald-600 bg-emerald-50";
      case "UPDATED": return "text-amber-600 bg-amber-50";
      case "DELETED": return "text-rose-600 bg-rose-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Audit Logs</h2>
          <p className="text-slate-500 mt-2 font-medium">Monitor and track all administrative actions in real-time.</p>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={16} className={cn(isLoading && "animate-spin")} />
          Refresh Activity
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search logs by user, action, or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-brand-forest/5 focus:border-brand-forest outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold appearance-none outline-none focus:ring-4 focus:ring-brand-forest/5 transition-all">
            <option>All actions</option>
            <option>Created</option>
            <option>Updated</option>
            <option>Deleted</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Action & Time</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Administrator</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Target Entity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw size={40} className="text-brand-forest animate-spin opacity-20" />
                      <p className="text-sm font-bold text-slate-400">Fetching activity records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Activity size={40} className="text-slate-200" />
                      <p className="text-sm font-bold text-slate-400">No activity logs found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider",
                          getActionColor(log.action)
                        )}>
                          {log.action}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                          <Calendar size={12} />
                          {format(new Date(log.createdAt), "MMM d, HH:mm")}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center text-xs font-black">
                          {log.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-none">{log.user.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1">{log.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <ChevronRight size={14} className="text-slate-300" />
                        {log.entity}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-slate-600 italic">"{log.details}"</p>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!isLoading && filteredLogs.length > 0 && (
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing last {filteredLogs.length} interactions • Security Audit Log
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
