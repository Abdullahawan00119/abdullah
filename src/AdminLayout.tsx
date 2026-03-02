import { useState, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  LogOut, 
  ChevronRight,
  Settings,
  FolderKanban,
  Quote,
  Star,
  Briefcase
} from "lucide-react";
import Loader from "./components/Loader";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (checkingAuth) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader /></div>;

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
    { icon: User, label: "Profile", path: "/admin/profile" },
    { icon: Star, label: "Skills", path: "/admin/skills" },
    { icon: FolderKanban, label: "Projects", path: "/admin/projects" },
    { icon: Briefcase, label: "Experience", path: "/admin/experience" },
    { icon: Quote, label: "Testimonials", path: "/admin/testimonials" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-sm">A</div>
            Admin
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="text-slate-400 group-hover:text-violet-400 transition-colors" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400" />
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
