import { useState, useEffect } from "react";
import { portfolioService } from "./services/portfolioService";
import { Save, User, Phone, Mail, Image as ImageIcon, Upload, Sparkles, Github, Linkedin } from "lucide-react";
import Loader from "./components/Loader";

export default function AdminProfile() {
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState<{ type: string | null }>({ type: null });
  const [message, setMessage] = useState("");

  useEffect(() => {
    portfolioService.getPortfolioData().then(data => setMeta(data.meta));
  }, []);

 

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'cv') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading({ type });
    try {
      // Use Cloudinary for both images and PDFs
      const url = await portfolioService.uploadToCloudinary(file);
      if (type === 'cv') {
        setMeta({ ...meta, cv_url: url });
        setMessage("✅ CV uploaded to Cloudinary successfully! Click 'Save Changes' to persist.");
      } else {
        setMeta({ ...meta, image_url: url });
        setMessage("✅ Image uploaded to Cloudinary successfully! Click 'Save Changes' to persist.");
      }
      // Reset file input
      e.target.value = "";
      setTimeout(() => setMessage(""), 4000);
    } catch (err: any) {
      console.error("Upload error:", err);
      const errorMsg = err?.message || "Upload failed. Please try again.";
      alert(`❌ Upload failed:\n${errorMsg}\n\nCheck browser console (F12) for details.`);
      e.target.value = "";
    } finally {
      setUploading({ type: null });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await portfolioService.updateMeta(meta);
      setMessage("Profile saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const generateAiBio = async () => {
    setAiLoading(true);
    try {
      // Placeholder for AI generation - you can integrate with your AI service
      const generatedBio = `I'm a passionate developer with expertise in full-stack development, creating beautiful and performant web experiences. I love building innovative solutions and staying updated with the latest technologies.`;
      setMeta({ ...meta, about: generatedBio });
      setMessage("✅ Bio generated! Click 'Save Changes' to persist.");
      setTimeout(() => setMessage(""), 4000);
    } catch (err: any) {
      console.error("AI Generation failed", err);
      alert(`AI Generation failed: ${err.message || "Unknown error"}`);
    } finally {
      setAiLoading(false);
    }
  };

  if (!meta) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Profile Settings</h1>
          <p className="text-slate-500 text-sm">Manage your personal information and social links.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all disabled:opacity-50"
        >
          <Save size={20} />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-2">
          <Sparkles size={16} />
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="text"
                    value={meta.name || ""}
                    onChange={(e) => setMeta({ ...meta, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Professional Role</label>
                <input
                  type="text"
                  value={meta.role || ""}
                  onChange={(e) => setMeta({ ...meta, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Short Bio (Hero Section)</label>
              <textarea
                value={meta.bio || ""}
                onChange={(e) => setMeta({ ...meta, bio: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none h-24 resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-500">Detailed About Me</label>
                <button
                  onClick={generateAiBio}
                  disabled={aiLoading}
                  className="text-[10px] uppercase font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <Sparkles size={12} />
                  {aiLoading ? "Generating..." : "Generate with AI"}
                </button>
              </div>
              <textarea
                value={meta.about || ""}
                onChange={(e) => setMeta({ ...meta, about: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none h-48 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="text"
                    value={meta.whatsapp || ""}
                    onChange={(e) => setMeta({ ...meta, whatsapp: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Public Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="email"
                    value={meta.email || ""}
                    onChange={(e) => setMeta({ ...meta, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">GitHub URL</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="text"
                    value={meta.github || ""}
                    onChange={(e) => setMeta({ ...meta, github: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">LinkedIn URL</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="text"
                    value={meta.linkedin || ""}
                    onChange={(e) => setMeta({ ...meta, linkedin: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-3">Profile Image</label>
              <div className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 mb-4">
                <img
                  src={meta.image_url || "https://via.placeholder.com/400"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <ImageIcon size={32} className="text-white mb-2" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    {uploading.type === 'image' ? "Uploading..." : "Change Image"}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">CV / Resume</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={meta.cv_url || ""}
                  onChange={(e) => setMeta({ ...meta, cv_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none text-xs"
                  placeholder="Cloudinary URL (uploaded via button below)"
                  disabled
                />
                <p className="text-[10px] text-slate-500 italic">☁️ Your CV is hosted on Cloudinary</p>
                <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-400 cursor-pointer hover:bg-white/10 transition-all">
                  <Upload size={14} />
                  {uploading.type === 'cv' ? "Uploading PDF..." : "Upload CV (PDF)"}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="application/pdf,.pdf" 
                    onChange={(e) => handleFileUpload(e, 'cv')}
                    disabled={uploading.type !== null}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
