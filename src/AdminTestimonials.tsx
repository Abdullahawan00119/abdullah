import { useState, useEffect } from "react";
import { portfolioService } from "./services/portfolioService";
import { Plus, Trash2, User, Star, Quote, Image as ImageIcon, Upload, Link as LinkIcon, Save, Edit2 } from "lucide-react";
import Loader from "./components/Loader";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialForm, setTestimonialForm] = useState({
    id: null as string | null,
    name: "",
    role: "",
    content: "",
    image_url: ""
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const data = await portfolioService.getPortfolioData();
      setTestimonials(data.testimonials);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await portfolioService.uploadToCloudinary(file);
      setTestimonialForm({ ...testimonialForm, image_url: url });
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (testimonialForm.id && testimonialForm.id !== null) {
        await portfolioService.updateTestimonial(testimonialForm.id, testimonialForm);
      } else {
        await portfolioService.addTestimonial(testimonialForm);
      }
      setTestimonialForm({ id: null, name: "", role: "", content: "", image_url: "" });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      alert("Action failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial: any) => {
    setTestimonialForm({
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      image_url: testimonial.image_url
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string | null | undefined) => {
    if (!id || id === 'null' || id === '') {
      console.warn("❌ handleDelete called without a valid id", id);
      alert('Cannot delete testimonial: invalid ID. Please refresh and try again.');
      return;
    }
    if (!confirm("Are you sure?")) return;
    try {
      await portfolioService.deleteTestimonial(id);
      fetchTestimonials();
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert("Delete failed: " + err.message);
    }
  };

  if (fetching) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader />
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Testimonials</h1>
        <p className="text-slate-400">Manage client feedback and reviews.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4 sticky top-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              {testimonialForm.id ? <Save size={20} className="text-emerald-400" /> : <Plus size={20} className="text-violet-400" />}
              {testimonialForm.id ? "Edit Testimonial" : "Add Testimonial"}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Client Name</label>
              <input
                type="text"
                value={testimonialForm.name || ""}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Role / Company</label>
              <input
                type="text"
                value={testimonialForm.role || ""}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                placeholder="e.g. CEO at TechCorp"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Content</label>
              <textarea
                value={testimonialForm.content || ""}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none resize-none"
                placeholder="What did they say?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Client Image</label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={testimonialForm.image_url || ""}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, image_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                  placeholder="External Image URL"
                />
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-400 cursor-pointer hover:bg-white/10 transition-all">
                    <Upload size={14} />
                    {uploading ? "Uploading..." : "Upload File"}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all"
              >
                {loading ? "Processing..." : testimonialForm.id ? "Update Testimonial" : "Add Testimonial"}
              </button>
              {testimonialForm.id && (
                <button
                  type="button"
                  onClick={() => setTestimonialForm({ id: null, name: "", role: "", content: "", image_url: "" })}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="grid gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={testimonial.id || `testimonial-${idx}`} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-slate-800">
                      <img
                        src={testimonial.image_url || `https://picsum.photos/seed/${testimonial.id}/100/100`}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-2 rounded-lg bg-violet-500/10 lg:bg-transparent hover:bg-violet-500/10 text-slate-400 hover:text-violet-400 transition-all"
                      title="Edit Testimonial"
                    >
                      <Edit2 size={18} />
                    </button>
                    {testimonial.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(testimonial.id);
                        }}
                        className="p-2 rounded-lg bg-red-500/10 lg:bg-transparent hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                        title="Delete Testimonial"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    {!testimonial.id && (
                      <div className="p-2 text-yellow-500 text-xs" title="Unable to delete: no ID">
                        ⚠️
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Quote size={16} className="text-violet-500 shrink-0 mt-1 opacity-50" />
                  <p className="text-sm text-slate-400 italic leading-relaxed">"{testimonial.content}"</p>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-white/5 rounded-3xl">
                No testimonials added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
