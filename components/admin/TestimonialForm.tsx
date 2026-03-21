"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import CloudinaryUpload from "./CloudinaryUpload";
import { createTestimonial, updateTestimonial } from "@/lib/actions/testimonial";
import { toast } from "sonner";

interface TestimonialFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TestimonialForm({ initialData, onSuccess, onCancel }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    rating: initialData?.rating || 5,
    active: initialData?.active ?? true,
  });
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      toast.error("Required Fields Missing");
      return;
    }

    setIsPending(true);
    try {
      let result;
      if (initialData?.id) {
        result = await updateTestimonial(initialData.id, formData);
      } else {
        result = await createTestimonial(formData);
      }

      if (result.success) {
        toast.success(initialData ? "Testimonial Updated" : "Testimonial Created");
        onSuccess();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Customer Photo</label>
            <CloudinaryUpload
              onUpload={(url) => setFormData({ ...formData, image: url })}
              defaultValue={formData.image}
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Role/Title (Optional)</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
              placeholder="e.g. Community Resident"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Testimonial Content</label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20 resize-none"
              placeholder="What did they say about Rooted Rising?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Status</label>
              <div className="flex items-center gap-2 h-11">
                <input 
                  type="checkbox" 
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 accent-brand-forest rounded-lg"
                  id="active-toggle"
                />
                <label htmlFor="active-toggle" className="text-sm font-bold text-slate-600">Active / Visible</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-black bg-brand-forest text-white shadow-xl shadow-brand-forest/10 hover:bg-brand-dark transition-all disabled:opacity-50"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {initialData ? "Save Changes" : "Publish Testimonial"}
        </button>
      </div>
    </form>
  );
}
