import { motion } from "motion/react";
import { Briefcase, Calendar } from "lucide-react";

export default function Experience({ experiences }: { experiences: any[] }) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Work Experience</h2>
          <p className="text-slate-400">My professional journey and career milestones.</p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id || `exp-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            >
              {/* Dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 bg-slate-950 text-violet-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2">
                <Briefcase size={18} />
              </div>
              
              {/* Content */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm hover:border-violet-500/30 transition-all ml-12 md:ml-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                  <div className="flex items-center gap-1 text-xs font-semibold text-violet-400 bg-violet-400/10 px-3 py-1 rounded-full">
                    <Calendar size={12} />
                    {exp.period}
                  </div>
                </div>
                <div className="text-emerald-400 font-medium mb-4 text-sm">{exp.company}</div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
