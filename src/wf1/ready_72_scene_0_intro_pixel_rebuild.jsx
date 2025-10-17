export default function Ready72Scene0PixelRebuild() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100">
      {/* Top chrome */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 mb-4 text-sm">
          {['Intro','Persona','Briefing','Store','Decision','Debrief'].map(t => (
            <span key={t} className={`px-3 py-1 rounded-full border ${t==='Intro' ? 'bg-white text-black border-white':'border-slate-600 text-slate-300'}`}>{t}</span>
          ))}
        </div>
        <div className="flex items-end justify-between border-b border-slate-700 pb-3">
          <div className="text-sm"><span className="text-orange-400 font-semibold">GoBag:</span> <span className="font-semibold">Ready72</span></div>
          <div className="text-xs text-slate-300">Scene 0 · Introduction</div>
        </div>
      </div>

      {/* Two-column content with asymmetric widths */}
      <main className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-[65%_35%] gap-6 items-start">
        {/* Left primary card */}
        <section className="bg-[#0F172A]/70 rounded-2xl border border-slate-700 p-6">
          <h1 className="text-2xl font-extrabold mb-2 text-white">Ready72 — Learn to prepare for seventy-two hours</h1>
          <p className="text-slate-300 mb-3">This experience uses the Minimum Survival Standard. It shows how to plan and make good choices during an emergency.</p>

          {/* Decorative progress bar */}
          <div className="w-full h-2 rounded-full overflow-hidden mb-3 border border-slate-700">
            <div className="w-full h-full bg-gradient-to-r from-green-600 via-yellow-400 to-red-500" />
          </div>

          {/* Bullets */}
          <ul className="list-disc list-inside space-y-1 text-slate-300 mb-4">
            <li>You will see simple ideas first. You will add skills as you play.</li>
            <li>Every item fits into a survival category like Water, Food, or Shelter.</li>
            <li>Your choices change your speed, energy, and safety.</li>
          </ul>

          {/* Buttons row */}
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold">Start</button>
            <button className="px-4 py-2 rounded-md border border-slate-600 hover:bg-slate-800 text-white">What is the Minimum Survival Standard?</button>
          </div>
        </section>

        {/* Right advisor stack smaller and top-aligned */}
        <aside className="bg-[#0F172A]/70 rounded-2xl border border-slate-700 p-4 self-start">
          <div className="text-[11px] tracking-wider text-slate-300 font-semibold mb-3">HAZASSIST · SYSTEM ADVISOR</div>
          <div className="space-y-3">
            {["Welcome to Ready72.","You will choose a profile and see a simple risk preview.","Balanced gear is better than carrying too much weight."].map((line, i) => (
              <div key={i} className="rounded-lg border border-slate-700/70 px-4 py-3 bg-transparent text-slate-100 text-sm">
                {line}
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
