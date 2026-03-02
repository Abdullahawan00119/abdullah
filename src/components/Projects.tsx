import { motion } from "motion/react";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Projects({ projects }: { projects: any[] }) {
  const featuredProjects = projects.slice(0, 3);

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-tighter">Featured Projects</h2>
            <p className="text-slate-400 max-w-lg">A selection of my recent work and personal projects that showcase my skills and passion.</p>
          </div>
          <Link 
            to="/projects" 
            className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-all"
          >
            View All Projects
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.id || `project-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group rounded-3xl bg-slate-900/50 border border-white/5 overflow-hidden hover:border-violet-500/30 transition-all"
            >
              <Link to={`/project/${project.id}`} className="aspect-video overflow-hidden block relative">
                <img
                  src={project.image_url || `https://picsum.photos/seed/${project.id}/800/450`}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* overlay to hint at clickability */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-6 py-2 rounded-full bg-white text-slate-950 font-bold text-sm">View Details</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
              </Link>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                  <Link to={`/project/${project.id}`}>{project.title}</Link>
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags?.split(',').map((tag: string, tIdx: number) => (
                    <span key={`${tag}-${tIdx}`} className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-slate-400 uppercase tracking-wider border border-white/5">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
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
      </div>
    </section>
  );
}
