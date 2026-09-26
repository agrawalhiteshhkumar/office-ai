export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl border border-slate-800 bg-slate-900/60 p-8 rounded-2xl shadow-2xl backdrop-blur">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
          Phase 1 Initializing
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          OFFICE AI™
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
          AI-Native Institutional Administrative, Governance, Regulatory & Evidence Operating System.
        </p>
        <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
          Baseline Engine • Multi-Tenant Foundation • DPKCOP Context
        </div>
      </div>
    </main>
  );
}
