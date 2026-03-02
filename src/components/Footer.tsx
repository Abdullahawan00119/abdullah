export default function Footer({ visitorCount }: { visitorCount: number }) {
  return (
    <footer className="py-12 px-4 border-t border-white/5 bg-slate-950/50 backdrop-blur-md text-center">
      <div className="max-w-7xl mx-auto">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Abdullah. All rights reserved. Built with React & Three.js.
        </p>
        {visitorCount > 0 && (
          <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-widest">
            Portfolio Visits: <span className="text-violet-500 font-mono">{visitorCount}</span>
          </p>
        )}
      </div>
    </footer>
  );
}
