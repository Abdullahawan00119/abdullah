import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink, Github, ArrowLeft, Search, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { portfolioService } from "./services/portfolioService";

export default function ProjectsPage() {
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    portfolioService.getPortfolioData().then(res => {
      setData(res);
      setProjects(Array.isArray(res.projects) ? res.projects : []);
    }).catch(err => {
      console.error("Failed to load portfolio data", err);
      setProjects([]);
    });
    window.scrollTo(0, 0);
  }, []);

  // show loader while data is being fetched
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const safeProjects = projects || [];
  const filteredProjects = safeProjects.filter(p => {
    const title = (p.title || "").toString().toLowerCase();
    const desc = (p.description || "").toString().toLowerCase();
    const tags = (p.tags || "").toString().toLowerCase();
    const term = search.toLowerCase();
    const matchesSearch = title.includes(term) || desc.includes(term) || tags.includes(term);
    const matchesFilter = filter === "All" || tags.includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const allTags = Array.from(new Set(safeProjects.flatMap(p => (p.tags||"").split(',').map((t: string) => t.trim()))));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
          <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">All Projects</h1>
          <p className="text-slate-400 max-w-2xl">
            A comprehensive list of my work, ranging from web applications to creative experiments.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1 ">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
            
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-100 pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none transition-all"
            />
          </div>
          {/* <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <button
              onClick={() => setFilter("All")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === "All" ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === tag ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                {tag}
              </button>
            ))}
          </div> */}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group rounded-3xl bg-slate-900/50 border border-white/5 overflow-hidden hover:border-white/10 transition-all flex flex-col"
            >
              <Link to={`/project/${project.id}`} className="block aspect-video overflow-hidden relative">
                <img
                  src={project.image_url || `https://picsum.photos/seed/${project.id}/800/600`}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-6 py-2 rounded-full bg-white text-slate-950 font-bold text-sm">View Details</span>
                </div>
              </Link>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex gap-2 mb-4">
                  {project.tags?.split(',').slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 rounded bg-violet-500/10 text-[10px] text-violet-400 uppercase tracking-widest font-bold border border-violet-500/20">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">
                  <Link to={`/project/${project.id}`}>{project.title}</Link>
                </h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 rounded-full bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                        title="View Code"
                      >
                        <Github size={18} />
                      </a>
                    )}
                  </div>
                  
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/20 group/btn"
                    >
                      Visit Live
                      <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-3xl">
            <div className="text-slate-500 mb-2">No projects found matching your criteria.</div>
            <button onClick={() => { setSearch(""); setFilter("All"); }} className="text-violet-400 font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
      <Footer visitorCount={data?.visitorCount || 0} />
    </div>
  );
}
