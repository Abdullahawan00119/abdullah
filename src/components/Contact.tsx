import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { portfolioService } from "../services/portfolioService";
import { useState } from "react";

export default function Contact({ meta }: { meta: any }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await portfolioService.sendMessage(data);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 bg-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-slate-400">Have a project in mind? Let's talk about it.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Email</div>
                  <div className="text-white text-lg">{meta?.email || 'abdullhalawan00119@gmail.com'}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">WhatsApp</div>
                  <div className="text-white text-lg">{meta?.whatsapp || '03178937641'}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Location</div>
                  <div className="text-white text-lg">Quetta, Balochistan, Pakistan</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CheckCircle size={64} className="text-emerald-400 mb-4" />
                <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-slate-400">Thank you for reaching out. I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                  <input
                    {...register("name", { required: true })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                    placeholder="Your Name"
                  />
                  {errors.name && <span className="text-xs text-red-400 mt-1">Name is required</span>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="text-xs text-red-400 mt-1">Valid email is required</span>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                  <textarea
                    {...register("message", { required: true })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && <span className="text-xs text-red-400 mt-1">Message is required</span>}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
                >
                  {isSubmitting ? "Sending..." : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
