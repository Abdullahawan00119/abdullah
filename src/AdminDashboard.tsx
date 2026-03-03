import { useState, useEffect } from "react";
import { portfolioService } from "./services/portfolioService";
import { 
  MessageSquare, 
  Eye, 
  Code, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";
import Loader from "./components/Loader";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioService.getPortfolioData();
        
        let messages: any[] = [];
        try {
          messages = await portfolioService.getMessages();
        } catch (msgErr) {
          console.warn("Could not fetch messages:", msgErr);
        }
        
        setStats({
          visitors: data.visitorCount || 0,
          messages: messages?.length || 0,
          skills: data.skills?.length || 0,
          projects: data.projects?.length || 0,
          testimonials: data.testimonials?.length || 0,
          experiences: data.experiences?.length || 0
        });
      } catch (err: any) {
        console.error("Dashboard fetch failed", err);
        // Set default stats on error so the dashboard still loads
        setStats({
          visitors: 0,
          messages: 0,
          skills: 0,
          projects: 0,
          testimonials: 0,
          experiences: 0
        });
      }
    };
    fetchData();
  }, []);

  if (!stats) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader />
    </div>
  );

  const cards = [
    { label: "Total Visitors", value: stats.visitors, icon: Eye, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Projects", value: stats.projects, icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Skills", value: stats.skills, icon: Code, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Testimonials", value: stats.testimonials, icon: Star, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "Experience", value: stats.experiences, icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center ${card.color}`}>
                <card.icon size={24} />
              </div>
              <ArrowUpRight size={20} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
            <div className="text-sm font-medium text-slate-500">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users size={20} className="text-violet-400" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Add Project", path: "/admin/projects" },
              { label: "Update Bio", path: "/admin/profile" },
              { label: "Check Messages", path: "/admin/messages" },
              { label: "Add Skill", path: "/admin/skills" },
            ].map(action => (
              <a
                key={action.label}
                href={action.path}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-sm font-semibold text-slate-300 text-center transition-all"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-500 mb-4">
            <Sparkles size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">AI Portfolio Assistant</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-xs">
            Use our AI tools in the Profile and Projects sections to generate professional content automatically.
          </p>
          <button className="px-6 py-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-all">
            Try AI Features
          </button>
        </div>
      </div>
    </div>
  );
}
