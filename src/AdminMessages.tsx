import { useState, useEffect } from "react";
import { portfolioService } from "./services/portfolioService";
import { MessageSquare, Mail, User, Clock, CheckCircle, Trash2, Reply } from "lucide-react";
import Loader from "./components/Loader";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await portfolioService.getMessages();
      setMessages(data);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async (msg: any) => {
    const subject = encodeURIComponent(`Portfolio Inquiry - Re: ${msg.name}`);
    const body = encodeURIComponent(`Hi ${msg.name},\n\nThank you for reaching out through my portfolio. I've received your message:\n\n"${msg.message}"\n\n---\nBest regards,\n[Your Name]`);
    window.open(`mailto:${msg.email}?subject=${subject}&body=${body}`);
    
    try {
      await portfolioService.updateMessageStatus(msg.id, 'replied');
      fetchMessages();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await portfolioService.deleteMessage(id);
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert("Failed to delete message.");
    }
  };

  if (fetching) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-slate-400">Manage inquiries from your portfolio.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {messages.map((msg) => (
          <div key={msg.id} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={14} />
                    {msg.email}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={12} />
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                {msg.status === 'replied' ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle size={12} /> Replied
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold">New</span>
                )}
              </div>
            </div>
            
            <p className="text-slate-300 bg-white/5 p-4 rounded-2xl mb-4 leading-relaxed">
              {msg.message}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleReply(msg)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-sm font-semibold transition-all"
              >
                <Reply size={16} />
                Reply
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(msg.id);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
