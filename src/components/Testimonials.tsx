import { motion } from "motion/react";
import { Quote } from "lucide-react";

export default function Testimonials({ testimonials }: { testimonials: any[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Client Testimonials</h2>
          <p className="text-slate-400">What people say about working with me.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id || `testimonial-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm relative"
            >
              <div className="text-violet-500 mb-6">
                <Quote size={40} fill="currentColor" className="opacity-20" />
              </div>
              
              <p className="text-slate-300 italic mb-8 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-violet-500/30">
                  <img
                    src={testimonial.image_url || `https://picsum.photos/seed/${testimonial.id}/100/100`}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
