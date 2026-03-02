import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navItems = [
    { label: 'Home', path: isHome ? '#home' : '/' },
    { label: 'About', path: isHome ? '#about' : '/#about' },
    { label: 'Skills', path: isHome ? '#skills' : '/#skills' },
    { label: 'Experience', path: isHome ? '#experience' : '/#experience' },
    { label: 'Projects', path: isHome ? '#projects' : '/projects' },
    { label: 'Testimonials', path: isHome ? '#testimonials' : '/#testimonials' },
    { label: 'Contact', path: isHome ? '#contact' : '/#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white tracking-tighter">
          A<span className="text-violet-500">.</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            item.path.startsWith('#') ? (
              <a key={item.label} href={item.path} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                {item.label}
              </a>
            ) : (
              <Link key={item.label} to={item.path} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                {item.label}
              </Link>
            )
          ))}
          <Link to="/admin" className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all">
            Admin
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-950 pt-20 px-4 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {navItems.map(item => (
                item.path.startsWith('#') ? (
                  <a
                    key={item.label}
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-bold text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-bold text-white"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
