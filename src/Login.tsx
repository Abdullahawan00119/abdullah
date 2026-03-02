import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-violet-500/20">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Access</h1>
          <p className="text-slate-400 mt-2">Enter your credentials to manage your portfolio.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none transition-all"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none transition-all"
              required
            />
          </div>

          {error && <div className="text-sm text-red-400 text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
          >
            {loading ? "Authenticating..." : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
            Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
