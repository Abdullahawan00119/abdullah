import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { Save, Lock, Mail, Shield, AlertCircle, CheckCircle } from "lucide-react";
import Loader from "./components/Loader";

export default function AdminSettings() {
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    if (auth.currentUser) {
      setEmail(auth.currentUser.email || "");
    }
    setFetching(false);
  }, []);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);
    setStatus(null);
    try {
      await updateEmail(auth.currentUser, email);
      setStatus({ type: 'success', msg: "Email updated successfully!" });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || "Failed to update email" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', msg: "Passwords do not match" });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email!, passwords.current);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwords.new);
      setStatus({ type: 'success', msg: "Password updated successfully!" });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || "Failed to update password" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader />
    </div>
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-slate-400">Manage your administrative credentials and security.</p>
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{status.msg}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Email Settings */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Mail size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Email Address</h2>
          </div>
          
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Update Email
            </button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Security</h2>
          </div>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
            >
              <Lock size={18} />
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
