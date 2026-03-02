import { useState, useEffect } from "react";
import { portfolioService } from "./services/portfolioService";
import { Plus, Trash2, ExternalLink, Github, Image as ImageIcon, Upload, Save, Sparkles, Edit2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import Loader from "./components/Loader";

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [projectForm, setProjectForm] = useState({
    id: null as string | null,
    title: "",
    description: "",
    image_url: "",
    link: "",
    github: "",
    tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchProjects = async () => {
    try {
      const data = await portfolioService.getPortfolioData();
      setProjects(data.projects);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const generateAiDescription = async () => {
    if (!projectForm.title) {
      alert("Please enter a project title first.");
      return;
    }
    if (!process.env.GEMINI_API_KEY) {
      alert("Gemini API Key is not configured. Please check your environment variables.");
      return;
    }
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a professional, concise project description for a portfolio. 
        Project Title: ${projectForm.title}
        Tags: ${projectForm.tags}
        Keep it under 60 words.`,
      });
      
      if (response.text) {
        setProjectForm({ ...projectForm, description: response.text });
      }
    } catch (err: any) {
      console.error("AI Generation failed", err);
      alert(`AI Generation failed: ${err.message || "Unknown error"}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await portfolioService.uploadToCloudinary(file);
      setProjectForm({ ...projectForm, image_url: url });
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
      if (projectForm.id && projectForm.id !== null) {
        await portfolioService.updateProject(projectForm.id, projectForm);
      } else {
        await portfolioService.addProject(projectForm);
      }
      setProjectForm({ id: null, title: "", description: "", image_url: "", link: "", github: "", tags: "" });
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Action failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: any) => {
    setProjectForm({
      id: project.id,
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      link: project.link,
      github: project.github,
      tags: project.tags
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string | null | undefined) => {
    if (!id || id === 'null' || id === '') {
      console.warn("❌ handleDelete called without a valid id", id);
      alert('Cannot delete project: invalid ID. Please refresh and try again.');
      return;
    }
    if (!confirm("Are you sure?")) return;
    try {
      await portfolioService.deleteProject(id);
      fetchProjects();
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
        <h1 className="text-3xl font-bold text-white">Projects Management</h1>
        <p className="text-slate-400">Showcase your best work on your portfolio.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4 sticky top-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              {projectForm.id ? <Save size={20} className="text-emerald-400" /> : <Plus size={20} className="text-violet-400" />}
              {projectForm.id ? "Edit Project" : "Add New Project"}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Project Title</label>
              <input
                type="text"
                value={projectForm.title || ""}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                placeholder="e.g. E-commerce App"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-500">Description</label>
                <button
                  type="button"
                  onClick={generateAiDescription}
                  disabled={aiLoading}
                  className="flex items-center gap-1 text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Sparkles size={10} />
                  {aiLoading ? "Generating..." : "AI Generate"}
                </button>
              </div>
              <textarea
                value={projectForm.description || ""}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none resize-none"
                placeholder="Briefly describe the project..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Image</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={projectForm.image_url || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                  placeholder="External URL"
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-400 cursor-pointer hover:bg-white/10 transition-all">
                  <Upload size={14} />
                  {uploading ? "Uploading..." : "Upload Project Image"}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Live Link</label>
                <input
                  type="text"
                  value={projectForm.link || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">GitHub Link</label>
                <input
                  type="text"
                  value={projectForm.github || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={projectForm.tags || ""}
                onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                placeholder="React, Node.js, Tailwind"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all"
              >
                {loading ? "Processing..." : projectForm.id ? "Update Project" : "Add Project"}
              </button>
              {projectForm.id && (
                <button
                  type="button"
                  onClick={() => setProjectForm({ id: null, title: "", description: "", image_url: "", link: "", github: "", tags: "" })}
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
            {projects.map((project, idx) => (
              <div key={project.id || `project-${idx}`} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 flex gap-6 group hover:border-white/10 transition-all">
                <div className="w-32 h-24 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src={project.image_url || `https://picsum.photos/seed/${project.id}/400/300`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">{project.title}</h4>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 rounded-lg bg-violet-500/10 lg:bg-transparent hover:bg-violet-500/10 text-slate-400 hover:text-violet-400 transition-all"
                        title="Edit Project"
                      >
                        <Edit2 size={18} />
                      </button>
                      {project.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id);
                          }}
                          className="p-2 rounded-lg bg-red-500/10 lg:bg-transparent hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                          title="Delete Project"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      {!project.id && (
                        <div className="p-2 text-yellow-500 text-xs" title="Unable to delete: no ID">
                          ⚠️
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex gap-2">
                      {project.tags?.split(',').map((tag: string, index: number) => (
                        <span key={`${tag}-${index}`} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-500 uppercase tracking-wider border border-white/5">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      {project.link && <ExternalLink size={16} className="text-slate-600" />}
                      {project.github && <Github size={16} className="text-slate-600" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-white/5 rounded-3xl">
                No projects added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
