import { useState, useEffect } from "react";
import { portfolioService } from "./services/portfolioService";
import { Plus, Trash2, Code, Save, Edit2 } from "lucide-react";
import * as SiIcons from "react-icons/si";
import Loader from "./components/Loader";

const IconPreview = ({ name }: { name: string }) => {
  const iconName = `Si${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`;
  const IconComponent = (SiIcons as any)[iconName];
  if (IconComponent) return <IconComponent size={20} />;
  return <Code size={20} />;
};

export default function AdminSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [skillForm, setSkillForm] = useState({ id: null as string | null, name: "", level: 80, category: "frontend" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchSkills = async () => {
    try {
      const data = await portfolioService.getPortfolioData();
      console.log('📊 Fetched portfolio data:', data);
      console.log('🎯 Skills array:', data.skills);
      if (data.skills && data.skills.length > 0) {
        console.log('📋 First skill:', data.skills[0]);
        console.log('⚠️ Has ID?', !!data.skills[0].id);
      }
      setSkills(data.skills);
    } catch (error) {
      console.error('❌ Error fetching skills:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (skillForm.id && skillForm.id !== null) {
        await portfolioService.updateSkill(skillForm.id, skillForm);
      } else {
        await portfolioService.addSkill(skillForm);
      }
      setSkillForm({ id: null, name: "", level: 80, category: "frontend" });
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert("Action failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: any) => {
    if (!skill?.id) {
      console.warn("handleEdit called with invalid skill", skill);
      return;
    }
    setSkillForm({
      id: skill.id,
      name: skill.name,
      level: skill.level,
      category: skill.category
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string | null | undefined) => {
    console.log('🗑️ handleDelete called with id:', id, 'type:', typeof id);
    
    if (!id || id === 'null' || id === '') {
      console.warn("❌ handleDelete called without a valid id", id);
      alert('Cannot delete skill: invalid ID. Please refresh and try again.');
      return;
    }

    if (!confirm("Are you sure?")) return;
    try {
      await portfolioService.deleteSkill(id);
      fetchSkills();
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert("Delete failed: " + err.message);
    }
  };

  const categories = ["frontend", "backend", "tools", "database", "other"];

  if (fetching) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader />
    </div>
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Skills Management</h1>
          <p className="text-slate-400">Manage technical expertise displayed on your portfolio.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4 sticky top-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              {skillForm.id ? <Save size={20} className="text-emerald-400" /> : <Plus size={20} className="text-violet-400" />}
              {skillForm.id ? "Edit Skill" : "Add New Skill"}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Skill Name</label>
              <input
                type="text"
                value={skillForm.name || ""}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                placeholder="e.g. React"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Category</label>
              <select
                value={skillForm.category || "frontend"}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Level ({skillForm.level}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={skillForm.level || 0}
                onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                className="w-full accent-violet-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all"
              >
                {loading ? "Processing..." : skillForm.id ? "Update Skill" : "Add Skill"}
              </button>
              {skillForm.id && (
                <button
                  type="button"
                  onClick={() => setSkillForm({ id: null, name: "", level: 80, category: "frontend" })}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-8">
            {categories.map(category => {
              const categorySkills = skills.filter(s => s.category === category);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category}>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                    {category}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {categorySkills.map((skill, sIdx) => {
                      if (!skill.id) {
                        console.warn('⚠️ Skill without ID at index', sIdx, ':', skill);
                      }
                      return (
                      <div key={skill.id || `skill-${sIdx}`} className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                            <IconPreview name={skill.name} />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{skill.name}</h4>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {skill.level}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="p-2 rounded-lg bg-violet-500/10 lg:bg-transparent hover:bg-violet-500/10 text-slate-400 hover:text-violet-400 transition-all"
                            title="Edit Skill"
                          >
                            <Edit2 size={16} />
                          </button>
                          {skill.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(skill.id);
                              }}
                              className="p-2 rounded-lg bg-red-500/10 lg:bg-transparent hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                              title="Delete Skill"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          {!skill.id && (
                            <div className="p-2 text-yellow-500 text-xs" title="Unable to delete: no ID">
                              ⚠️
                            </div>
                          )}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {skills.length === 0 && (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-white/5 rounded-3xl">
                No skills added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
