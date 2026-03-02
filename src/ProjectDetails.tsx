import { useState, useEffect } from "react";
// axios is no longer needed; data comes from our service layer
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ExternalLink, Github, ArrowLeft, Calendar, Tag, Globe, Code, Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { portfolioService } from "./services/portfolioService";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      // missing id -> send back
      navigate("/projects");
      return;
    }

    const fetchProject = async () => {
      try {
        const res = await portfolioService.getPortfolioData();
        setData(res);
        const list = Array.isArray(res.projects) ? res.projects : [];
        const found = list.find((p: any) => p.id === id);
        if (found) {
          setProject(found);
        } else {
          navigate("/projects");
        }
      } catch (err) {
        console.error("Error loading project details:", err);
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading project details...</div>;
  if (!project) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 px-4">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <Link to="/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-wrap gap-2">
              {project.tags?.split(',').map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-violet-500/10 text-xs text-violet-400 uppercase tracking-widest font-bold border border-violet-500/20">
                  {tag.trim()}
                </span>
              ))}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase">
              {project.title}
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-6">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-violet-500/20"
                >
                  <Globe size={18} />
                  Live Preview
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10 flex items-center gap-2"
                >
                  <Github size={18} />
                  Source Code
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-12 border-t border-white/5">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                  <Calendar size={14} className="text-violet-500" /> Date
                </div>
                <div className="text-white font-medium">2024 - Present</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                  <Code size={14} className="text-emerald-500" /> Category
                </div>
                <div className="text-white font-medium">Web Development</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={project.image_url || `https://picsum.photos/seed/${project.id}/1200/900`}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="mt-12 p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-violet-400" /> Key Features
              </h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
                  Modern and responsive UI/UX design.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
                  High-performance optimized code.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
                  Seamless integration with backend APIs.
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer visitorCount={data?.visitorCount || 0} />
    </div>
  );
}
