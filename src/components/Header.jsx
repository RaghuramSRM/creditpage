import { Rocket, GitFork, LayoutGrid } from 'lucide-react';

export default function Header({ onOpenControlRoom, viewMode, setViewMode }) {
  return (
    <header className="relative text-center min-h-[100dvh] flex flex-col justify-center items-center px-4" style={{ zIndex: 10 }}>

      {/* ── Club Badge ── */}
      <div className="flex justify-center mb-5">
        <div className="glass-pill inline-flex items-center gap-2.5 px-5 py-2 hover:scale-105 transition-transform no-select">
          <span className="text-base">🎮</span>
          <span className="font-orbitron font-bold text-xs tracking-[0.22em] uppercase text-[#ffc700]">
            Game Development Club
          </span>
        </div>
      </div>

      {/* ── Hero Title ── */}
      <div className="mb-2">
        <h1
          className="font-orbitron font-black uppercase leading-none text-white drop-shadow-[0_4px_24px_rgba(255,199,0,0.4)]"
          style={{ fontSize: 'clamp(2.4rem, 8vw, 5.6rem)', letterSpacing: '0.07em' }}
        >
          CREDITS
        </h1>
        <h2
          className="font-orbitron font-black uppercase leading-none text-gradient-gold"
          style={{ fontSize: 'clamp(2.4rem, 8vw, 5.6rem)', letterSpacing: '0.07em' }}
        >
          MISSION CONTROL
        </h2>
      </div>

      {/* ── Subtitle ── */}
      <div className="max-w-xl mx-auto mb-9 mt-6 px-6 py-4 rounded-3xl glass-card">
        <p className="font-inter text-sm md:text-base leading-relaxed font-medium text-slate-300">
          Meet the team behind Outpost 07. Explore the command hierarchy, inspect member dossiers, and celebrate our game creators.
        </p>
      </div>

      {/* ── CTA Button ── */}
      <div className="flex justify-center mb-9">
        <button
          onClick={onOpenControlRoom}
          className="btn-primary flex items-center gap-3 text-sm"
          id="enter-control-room-btn"
        >
          <Rocket size={17} className="animate-bounce" />
          <span>Enter Credits Vault</span>
        </button>
      </div>

      {/* ── View Toggle ── */}
      <div className="flex justify-center">
        <div className="glass-card inline-flex items-center p-1.5 rounded-2xl gap-1">
          {[
            { mode: 'tree',  icon: <GitFork size={13} />,   label: 'Hierarchy' },
            { mode: 'grid',  icon: <LayoutGrid size={13} />, label: 'Grid Roster' },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-2 py-2 px-5 rounded-xl font-orbitron text-[0.65rem] font-bold uppercase tracking-widest transition-all duration-300 ${
                viewMode === mode ? 'tab-active' : 'text-slate-400 hover:text-[#ffc700] hover:bg-white/5'
              }`}
              id={`${mode}-view-tab`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

    </header>
  );
}
