import { motion } from "motion/react";
import { Mail, Phone, Github, Linkedin, Download, ArrowRight } from "lucide-react";

export default function Hero({ meta }: { meta: any }) {
  const handleDownloadCV = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!meta?.cv_url) {
      alert("CV not configured. Please upload your CV in the admin panel.");
      return;
    }

    const cvUrl = meta.cv_url;
    console.log("📥 Attempting to download CV from:", cvUrl);

    try {
      // For PDF files stored in Cloudinary, we'll try multiple approaches
      if (cvUrl.includes('cloudinary.com') && cvUrl.includes('.pdf')) {
        // Method 1: Try with fl_attachment for raw files
        if (cvUrl.includes('/raw/upload/')) {
          const downloadUrl = cvUrl.replace('/raw/upload/', '/raw/upload/fl_attachment/');
          console.log("📥 Method 1 - Trying raw download URL:", downloadUrl);
          window.open(downloadUrl, '_blank');
          return;
        }
        
        // Method 2: Try with fl_attachment for image files (when PDF was uploaded as image)
        if (cvUrl.includes('/image/upload/')) {
          const downloadUrl = cvUrl.replace('/image/upload/', '/image/upload/fl_attachment/');
          console.log("📥 Method 2 - Trying image download URL:", downloadUrl);
          
          // Open the download URL
          window.open(downloadUrl, '_blank');
          
          // Also try opening the original URL in a new tab as fallback
          setTimeout(() => {
            console.log("📥 Opening original URL as fallback");
            window.open(cvUrl, '_blank');
          }, 1000);
          return;
        }
      }

      // For non-Cloudinary URLs or other cases, use direct open
      console.log("📥 Using direct open method");
      window.open(cvUrl, '_blank');
      
      console.log("✅ CV download initiated successfully");
    } catch (err: any) {
      console.error("❌ Download failed:", err);
      // Final fallback: try opening directly
      console.log("📥 Final fallback: direct open");
      window.open(cvUrl, '_blank');
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center px-4 pt-32 pb-20 overflow-hidden">
      {/* Background oversized text - Hidden on small screens for better performance and less clutter */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black text-white/[0.01] select-none pointer-events-none uppercase leading-none whitespace-nowrap z-0 hidden sm:block">
        Creative
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left order-2 lg:order-1"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Available for New Projects
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
            {meta?.name?.split(' ')[0] || 'Abdullah'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-emerald-400 to-violet-400 bg-[length:200%_auto] animate-gradient">
              {meta?.name?.split(' ')[1] || 'Portfolio'}
            </span>
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
            <h2 className="text-xl md:text-2xl text-slate-100 font-bold tracking-tight">
              {meta?.role || 'Full Stack Developer'}
            </h2>
            <span className="hidden sm:block w-2 h-2 rounded-full bg-violet-500"></span>
            <p className="text-sm md:text-base text-slate-400 font-semibold uppercase tracking-widest">
              Based in Pakistan
            </p>
          </div>
          
          <p className="text-base md:text-lg text-slate-400 mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium px-4 sm:px-0">
            {meta?.bio || 'Crafting immersive digital experiences with modern web technologies and a focus on performance and design.'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 px-4 sm:px-0">
            <a
              href="#contact"
              className="group w-full sm:w-auto px-12 py-6 bg-white text-slate-950 hover:bg-violet-500 hover:text-white rounded-full font-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-violet-500/20 uppercase tracking-widest text-[12px]"
            >
              Start a Project
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={meta?.cv_url || "#"}
              onClick={handleDownloadCV}
              className="w-full sm:w-auto px-12 py-6 bg-white/5 hover:bg-white/10 text-white rounded-full font-black transition-all border border-white/10 flex items-center justify-center gap-3 uppercase tracking-widest text-[12px]"
            >
              <Download size={20} />
              Download CV
            </a>
          </div>
          
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-slate-500">
            {[
              { icon: Phone, href: meta?.whatsapp ? `https://wa.me/${meta.whatsapp}` : null, color: 'hover:text-emerald-400' },
              { icon: Mail, href: meta?.email ? `mailto:${meta.email}` : null, color: 'hover:text-violet-400' },
              { icon: Github, href: meta?.github || '#', color: 'hover:text-white' },
              { icon: Linkedin, href: meta?.linkedin || '#', color: 'hover:text-blue-400' }
            ].map((social, i) => social.href && (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className={`${social.color} transition-all duration-300`}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="relative flex justify-center order-1 lg:order-2"
        >
          <div className="relative w-full aspect-square max-w-[300px] sm:max-w-[400px] group">
            {/* Animated Rings */}
            <div className="absolute -inset-4 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute -inset-8 border border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
            
            {/* Circle Image Container */}
            <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.1)] transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(139,92,246,0.2)] group-hover:border-violet-500/30">
              <img
                src={meta?.image_url || `https://picsum.photos/seed/abdullah/800/800`}
                alt={meta?.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  console.warn('⚠️ Profile image failed to load, using fallback');
                  e.currentTarget.src = `https://picsum.photos/seed/abdullah/800/800`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-80"></div>
            </div>

            {/* Floating Experience Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 -right-4 z-20 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl"
            >
              <div className="text-2xl font-black text-emerald-400 mb-0.5 tracking-tighter">5+</div>
              <div className="text-[8px] uppercase tracking-[0.2em] text-slate-500 font-black whitespace-nowrap">Years Exp.</div>
            </motion.div>
            
            {/* Floating Projects Badge */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-4 -left-4 z-20 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl"
            >
              <div className="text-2xl font-black text-violet-400 mb-0.5 tracking-tighter">50+</div>
              <div className="text-[8px] uppercase tracking-[0.2em] text-slate-500 font-black whitespace-nowrap">Projects</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background oversized text */}
      <div className="absolute -bottom-20 -right-20 text-[20vw] font-black text-white/[0.02] select-none pointer-events-none uppercase leading-none">
        Creative
      </div>
    </section>
  );
}
