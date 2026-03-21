"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MessageSquare, Star, Search, Quote } from "lucide-react";
import { getTestimonials, deleteTestimonial } from "@/lib/actions/testimonial";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { toast } from "sonner";
import Image from "next/image";

import { getSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    const result = await getTestimonials();
    if (result.success) {
      setTestimonials(result.data || []);
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
          fetchTestimonials();
      }
    }
    checkAuth();
  }, []);

  if (isAuthorized === null) return null;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the testimonial from ${name}?`)) return;

    const result = await deleteTestimonial(id);
    if (result.success) {
      toast.success("Testimonial deleted");
      fetchTestimonials();
    } else {
      toast.error(result.error);
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">Testimonials</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Manage and review community feedback and testimonials.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { setEditingTestimonial(null); setShowForm(true); }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-brand-forest px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-forest/10 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Testimonial
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">{editingTestimonial ? "Edit Testimonial" : "New Testimonial"}</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24} /></button>
          </div>
          <TestimonialForm 
            initialData={editingTestimonial} 
            onSuccess={() => { setShowForm(false); fetchTestimonials(); }}
            onCancel={() => setShowForm(false)} 
          />
        </div>
      ) : (
        <>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-forest/5 focus:border-brand-forest"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-500 relative">
                <div className="absolute top-6 right-6 flex gap-2">
                    <button 
                      onClick={() => { setEditingTestimonial(testimonial); setShowForm(true); }}
                      className="h-8 w-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center border border-slate-100 hover:text-brand-forest hover:bg-white shadow-sm transition-all"
                    >
                       <Edit2 size={14} />
                    </button>
                    <button 
                       onClick={() => handleDelete(testimonial.id, testimonial.name)}
                       className="h-8 w-8 bg-rose-50 text-rose-400 rounded-lg flex items-center justify-center border border-rose-100 hover:bg-rose-500 hover:text-white shadow-sm transition-all"
                    >
                       <Trash2 size={14} />
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                   <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm shrink-0">
                      {testimonial.image ? (
                        <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                          <Plus size={24} />
                        </div>
                      )}
                   </div>
                   <div>
                      <h4 className="font-black text-slate-900 leading-tight">{testimonial.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{testimonial.role || "Verified Partner"}</p>
                   </div>
                </div>

                <div className="flex-1 relative">
                   <Quote className="absolute -top-2 -left-2 text-slate-50" size={48} />
                   <p className="text-sm font-medium text-slate-600 leading-relaxed italic relative z-10">"{testimonial.content}"</p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} className={star <= testimonial.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                      ))}
                   </div>
                   <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${testimonial.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      {testimonial.active ? "Active" : "Hidden"}
                   </span>
                </div>
              </div>
            ))}
            
            {filteredTestimonials.length === 0 && !isLoading && (
              <div className="md:col-span-2 py-16 sm:py-24 bg-white rounded-4xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 text-center px-6">
                 <MessageSquare size={48} className="mb-4 opacity-20" />
                 <p className="font-bold">No community feedback records found.</p>
                 <button 
                   onClick={() => setShowForm(true)}
                   className="mt-4 text-sm font-bold text-brand-forest hover:underline"
                 >
                   Write a manual entry
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
