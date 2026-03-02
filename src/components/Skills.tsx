import { motion } from "motion/react";
import * as SiIcons from "react-icons/si";
import { Code } from "lucide-react";

const getIcon = (name: string) => {
  const iconName = `Si${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`;
  const IconComponent = (SiIcons as any)[iconName];
  
  const colors: Record<string, string> = {
    'react': '#61DAFB',
    'node': '#339933',
    'nodejs': '#339933',
    'express': '#000000',
    'mongodb': '#47A248',
    'typescript': '#3178C6',
    'javascript': '#F7DF1E',
    'tailwind': '#06B6D4',
    'tailwindcss': '#06B6D4',
    'nextjs': '#000000',
    'python': '#3776AB',
    'threejs': '#000000',
    'docker': '#2496ED',
    'git': '#F05032',
    'figma': '#F24E1E',
    'html': '#E34F26',
    'css': '#1572B6',
    'sass': '#CC6699',
    'firebase': '#FFCA28',
    'aws': '#232F3E'
  };

  const color = colors[name.toLowerCase()] || '#8B5CF6'; // Default to violet-500

  if (IconComponent) return <IconComponent size={32} style={{ color }} />;
  
  const fallbacks: Record<string, any> = {
    'react': SiIcons.SiReact,
    'node': SiIcons.SiNodedotjs,
    'nodejs': SiIcons.SiNodedotjs,
    'express': SiIcons.SiExpress,
    'mongodb': SiIcons.SiMongodb,
    'typescript': SiIcons.SiTypescript,
    'javascript': SiIcons.SiJavascript,
    'tailwind': SiIcons.SiTailwindcss,
    'nextjs': SiIcons.SiNextdotjs,
    'python': SiIcons.SiPython,
    'threejs': SiIcons.SiThreedotjs,
    'docker': SiIcons.SiDocker,
    'git': SiIcons.SiGit,
    'figma': SiIcons.SiFigma
  };
  
  const FallbackIcon = fallbacks[name.toLowerCase()];
  return FallbackIcon ? <FallbackIcon size={32} style={{ color }} /> : <Code size={32} />;
};

export default function Skills({ skills }: { skills: any[] }) {
  const categories = Array.from(new Set(skills.map(s => s.category || 'Other')));

  return (
    <section id="skills" className="py-24 px-4 bg-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Expertise</h2>
          <p className="text-slate-400">A comprehensive set of tools and technologies I've mastered.</p>
        </div>

        <div className="space-y-16">
          {categories.map((category, idx) => (
            <div key={category}>
              <h3 className="text-xl font-bold text-white mb-8 capitalize flex items-center gap-3">
                <span className="w-8 h-1 bg-violet-500 rounded-full"></span>
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {skills.filter(s => s.category === category).map((skill, sIdx) => (
                  <motion.div
                    key={skill.id || `skill-${sIdx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: sIdx * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="group relative p-6 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm flex flex-col items-center justify-center text-center hover:border-violet-500/30 transition-all"
                  >
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {getIcon(skill.name)}
                    </div>
                    <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                      {skill.name}
                    </span>
                    
                    {/* Tooltip for level */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-violet-600 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {skill.level}% Proficiency
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
