import { useState, useEffect } from "react";
import { portfolioService } from "./services/portfolioService";
import { Plus, Trash2, Briefcase, Calendar, FileText, Save, Edit2 } from "lucide-react";
import Loader from "./components/Loader";

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [expForm, setExpForm] = useState({
    id: null as string | null,
    title: "",
    company: "",
    period: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchExperiences = async () => {
    try {
      const data = await portfolioService.getPortfolioData();
      setExperiences(data.experiences);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (expForm.id && expForm.id !== null) {
        await portfolioService.updateExperience(expForm.id, expForm);
      } else {
        await portfolioService.addExperience(expForm);
      }
      setExpForm({ id: null, title: "", company: "", period: "", description: "" });
      fetchExperiences();
    } catch (err) {
      console.error(err);
      alert("Action failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp: any) => {
    setExpForm({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      period: exp.period,
      description: exp.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string | null | undefined) => {
    if (!id || id === 'null' || id === '') {
      console.warn("❌ handleDelete called without a valid id", id);
      alert('Cannot delete experience: invalid ID. Please refresh and try again.');
      return;
    }
    if (!confirm("Are you sure?")) return;
    try {
      await portfolioService.deleteExperience(id);
      fetchExperiences();
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
        <h1 className="text-3xl font-bold text-white">Experience Management</h1>
        <p className="text-slate-400">Manage your professional work history.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4 sticky top-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              {expForm.id ? <Save size={20} className="text-emerald-400" /> : <Plus size={20} className="text-violet-400" />}
              {expForm.id ? "Edit Experience" : "Add Experience"}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Job Title</label>
              <input
                type="text"
                value={expForm.title || ""}
                onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                placeholder="e.g. Senior Developer"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Company</label>
              <input
                type="text"
                value={expForm.company || ""}
                onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                placeholder="e.g. Tech Solutions Inc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Period</label>
              <input
                type="text"
                value={expForm.period || ""}
                onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                placeholder="e.g. 2021 - Present"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Description</label>
              <textarea
                value={expForm.description || ""}
                onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none resize-none"
                placeholder="Key responsibilities and achievements..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all"
              >
                {loading ? "Processing..." : expForm.id ? "Update Experience" : "Add Experience"}
              </button>
              {expForm.id && (
                <button
                  type="button"
                  onClick={() => setExpForm({ id: null, title: "", company: "", period: "", description: "" })}
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
            {experiences.map((exp, idx) => (
              <div key={exp.id || `exp-${idx}`} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{exp.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{exp.company}</span>
                        <span className="mx-1">•</span>
                        <Calendar size={14} />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-2 rounded-lg bg-violet-500/10 lg:bg-transparent hover:bg-violet-500/10 text-slate-400 hover:text-violet-400 transition-all"
                      title="Edit Experience"
                    >
                      <Edit2 size={18} />
                    </button>
                    {exp.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(exp.id);
                        }}
                        className="p-2 rounded-lg bg-red-500/10 lg:bg-transparent hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                        title="Delete Experience"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    {!exp.id && (
                      <div className="p-2 text-yellow-500 text-xs" title="Unable to delete: no ID">
                        ⚠️
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <FileText size={16} className="text-slate-600 shrink-0 mt-1" />
                  <p className="text-sm text-slate-400 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
            {experiences.length === 0 && (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-white/5 rounded-3xl">
                No experience entries added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
