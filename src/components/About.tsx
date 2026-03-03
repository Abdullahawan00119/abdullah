import { motion } from "motion/react";
import { Sparkles, ArrowRight, User, Target, Award, Quote } from "lucide-react";

export default function About({ about }: { about: string }) {
  if (!about) return null;

  return (
    <section id="about" className="py-20 md:py-28 px-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-violet-600/5 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-emerald-600/5 rounded-full blur-[80px] md:blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] md:text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em] mb-6">
            <User size={12} />
            About Me
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-none tracking-tighter uppercase">
            The Journey of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">
              Innovation
            </span>
          </h2>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-10 rounded-[2rem] bg-slate-900/40 border border-white/5 backdrop-blur-sm relative group"
          >
            <Quote size={60} className="absolute top-6 right-6 text-white/5 group-hover:text-white/10 transition-colors" />
            <div className="text-base md:text-xl text-slate-300 leading-relaxed font-medium">
              <p className="first-letter:text-5xl md:first-letter:text-6xl first-letter:font-black first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                {about}
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-violet-500/20 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4">
                <Target size={20} />
              </div>
              <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Mission</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Engineering digital solutions that blend functionality with intuitive design.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <Award size={20} />
              </div>
              <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Vision</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Redefining digital landscapes through bold innovation and quality.</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[2rem] bg-gradient-to-br from-violet-600/5 to-emerald-600/5 border border-white/5 flex flex-wrap items-center justify-center gap-8 md:gap-16"
          >
            <div className="text-center">
              <div className="text-3xl font-black text-white">1+</div>
              <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">Years Experience</div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-400">15+</div>
              <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">Projects Done</div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-3xl font-black text-violet-400">100%</div>
              <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">Client Satisfaction</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
