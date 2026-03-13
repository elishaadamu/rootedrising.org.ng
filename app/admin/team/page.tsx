"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Users, MoveUp, MoveDown, Search } from "lucide-react";
import { getTeamMembers, deleteTeamMember } from "@/lib/actions/team";
import TeamMemberForm from "@/components/admin/TeamMemberForm";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async () => {
    setIsLoading(true);
    const result = await getTeamMembers();
    if (result.success) {
      setMembers(result.data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    const result = await deleteTeamMember(id);
    if (result.success) {
      toast.success("Member deleted");
      fetchMembers();
    } else {
      toast.error(result.error);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">Team Management</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Manage the leadership team and organization members.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { setEditingMember(null); setShowForm(true); }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-brand-forest px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-forest/10 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Team Member
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">{editingMember ? "Edit Team Member" : "New Team Member"}</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24} /></button>
          </div>
          <TeamMemberForm 
            initialData={editingMember} 
            onSuccess={() => { setShowForm(false); fetchMembers(); }}
            onCancel={() => setShowForm(false)} 
          />
        </div>
      ) : (
        <>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-forest/5 focus:border-brand-forest"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-4xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-500">
                <div className="relative h-48 overflow-hidden">
                   {member.image ? (
                     <Image 
                       src={member.image} 
                       alt={member.name} 
                       fill
                       className="object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                   ) : (
                     <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                       <Users size={48} />
                     </div>
                   )}
                   <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => { setEditingMember(member); setShowForm(true); }}
                        className="h-9 w-9 bg-white/90 backdrop-blur-md text-slate-600 rounded-xl flex items-center justify-center border border-slate-200 hover:text-brand-forest hover:bg-white shadow-sm transition-all"
                      >
                         <Edit2 size={16} />
                      </button>
                      <button 
                         onClick={() => handleDelete(member.id, member.name)}
                         className="h-9 w-9 bg-rose-50/90 backdrop-blur-md text-rose-500 rounded-xl flex items-center justify-center border border-rose-100 hover:bg-rose-500 hover:text-white shadow-sm transition-all"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1 line-clamp-1">{member.name}</h3>
                  <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest mb-4">{member.role}</p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium line-clamp-3 mb-6 flex-1">{member.bio}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                     <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Order: {member.order}</span>
                     <div className="flex gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                       {member.linkedin ? <span className="text-[#0a66c2]/80">LinkedIN</span> : null}
                       {member.email ? <span>• Email</span> : null}
                     </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredMembers.length === 0 && !isLoading && (
              <div className="lg:col-span-3 py-16 sm:py-24 bg-white rounded-4xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
                 <Users size={48} className="mb-4 opacity-20" />
                 <p className="font-bold">No team members found.</p>
                 <button 
                   onClick={() => setShowForm(true)}
                   className="mt-4 text-sm font-bold text-brand-forest hover:underline"
                 >
                   Add your first member
                 </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
