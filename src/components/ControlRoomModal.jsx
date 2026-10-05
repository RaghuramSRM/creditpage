import { useState } from 'react';
import { X, Trophy, Users, ShieldCheck, Sparkles, Search, Star, Layers } from 'lucide-react';
import membersData from '../data/members';

export default function ControlRoomModal({ isOpen, onClose, onSelectMember }) {
  const [search, setSearch]             = useState('');
  const [activeSection, setActiveSection] = useState('All');

  if (!isOpen) return null;

  const totalMembers   = membersData.length;
  const officersCount  = membersData.filter(m => m.section === 'Leadership').length;
  const divisionsCount = 4;
  const totalProjects  = membersData.reduce((acc, m) => acc + m.projects.length, 0);

  const filteredMembers = membersData.filter(m => {
    const q = search.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.rollNo.toLowerCase().includes(q) ||
      m.specialization.toLowerCase().includes(q);
    const matchesSection = activeSection === 'All' || m.section === activeSection;
    return matchesSearch && matchesSection;
  });

  const sections = ['All', 'Leadership', 'Event Coordinators', 'Tech Team', 'Executive Members'];

  const stats = [
    { label: 'Total Members',    value: totalMembers,               color: '#0057b8', icon: <Users size={22} /> },
    { label: 'Active Divisions', value: `${divisionsCount} Squads`, color: '#0891b2', icon: <Layers size={22} /> },
    { label: 'Officer Command',  value: `${officersCount} Leads`,   color: '#7c3aed', icon: <ShieldCheck size={22} /> },
    { label: 'Total Projects',   value: `${totalProjects}+`,        color: '#059669', icon: <Trophy size={22} /> },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden flex items-center justify-center p-3 sm:p-6 animate-fade-in" style={{ zIndex: 300 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{
          background: 'rgba(180,225,255,0.6)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        }}
      />

      {/* Modal Window */}
      <div
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(255,255,255,0.9)',
          backdropFilter: 'blur(28px) saturate(200%)',
          boxShadow: '0 24px 80px rgba(0,150,220,0.22), inset 0 1px 0 rgba(255,255,255,1)',
        }}
      >
        {/* ── Header Bar ── */}
        <div
          className="flex flex-wrap items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(0,200,232,0.2)', background: 'rgba(255,255,255,0.6)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-cinzel font-black text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0057b8, #00c8e8, #00d084)' }}
            >
              🌿
            </div>
            <div>
              <span className="font-cinzel text-[0.6rem] tracking-[0.25em] uppercase block font-bold" style={{ color: '#0057b8' }}>
                Game Development Club
              </span>
              <h2 className="font-cinzel font-extrabold text-lg md:text-xl tracking-wide" style={{ color: '#0a1f2e' }}>
                Credits Control Center
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-rajdhani font-semibold border"
              style={{ background: 'rgba(0,200,232,0.08)', borderColor: 'rgba(0,200,232,0.3)', color: '#0057b8' }}
            >
              <Sparkles size={13} className="animate-pulse" />
              <span>ROSTER ACTIVE</span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.6)', borderColor: 'rgba(0,200,232,0.3)', color: '#0a1f2e' }}
              id="close-control-room"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-5 border-b" style={{ borderColor: 'rgba(0,200,232,0.15)', background: 'rgba(255,255,255,0.35)' }}>
          {stats.map(({ label, value, color, icon }) => (
            <div
              key={label}
              className="p-4 rounded-2xl flex items-center justify-between"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: `1px solid ${color}30`,
                boxShadow: `0 4px 16px ${color}12`,
              }}
            >
              <div>
                <p className="font-rajdhani text-xs uppercase tracking-wider mb-0.5 font-semibold" style={{ color }}>
                  {label}
                </p>
                <p className="font-cinzel text-xl font-black" style={{ color: '#0a1f2e' }}>{value}</p>
              </div>
              <span style={{ color, opacity: 0.8 }}>{icon}</span>
            </div>
          ))}
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b" style={{ borderColor: 'rgba(0,200,232,0.15)', background: 'rgba(255,255,255,0.25)' }}>
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={15} style={{ color: '#5a8ca0' }} />
            <input
              type="text"
              placeholder="Search by name, role, or specialization..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl pl-10 pr-4 py-2 text-sm placeholder-[#5a8ca0] focus:outline-none font-rajdhani font-medium transition-all border"
              style={{
                background: 'rgba(255,255,255,0.65)',
                borderColor: 'rgba(0,200,232,0.25)',
                color: '#0a1f2e',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,200,232,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,200,232,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(0,200,232,0.25)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {sections.map(sec => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-3.5 py-1.5 rounded-xl font-cinzel text-[0.62rem] font-bold uppercase tracking-wide transition-all cursor-pointer ${
                  activeSection === sec ? 'tab-active' : 'btn-ghost'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* ── Member Roster ── */}
        <div className="flex-1 overflow-y-auto modal-scroll p-4 sm:p-5 space-y-2.5" style={{ background: 'rgba(255,255,255,0.15)' }}>
          {filteredMembers.length === 0 && (
            <div className="text-center py-16 font-rajdhani tracking-widest text-sm uppercase" style={{ color: '#5a8ca0' }}>
              No members found
            </div>
          )}
          {filteredMembers.map(member => {
            const initials = member.name.split(' ').slice(0, 2).map(n => n[0]).join('');
            return (
              <div
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border transition-all"
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(255,255,255,0.8)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,200,232,0.45)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,200,232,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div className="flex items-center gap-3.5 min-w-[200px]">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-cinzel font-extrabold text-sm shrink-0"
                    style={{ background: 'rgba(0,200,232,0.1)', border: '1px solid rgba(0,200,232,0.3)', color: '#0057b8' }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-cinzel font-bold text-sm" style={{ color: '#0a1f2e' }}>{member.name}</h4>
                    <p className="font-rajdhani text-xs font-medium mt-0.5" style={{ color: '#5a8ca0' }}>
                      {member.role} · <span style={{ color: '#0057b8' }}>{member.rollNo}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="font-rajdhani text-xs font-semibold px-3 py-1 rounded-full hidden md:inline-block"
                    style={{ background: 'rgba(0,200,232,0.08)', border: '1px solid rgba(0,200,232,0.2)', color: '#0057b8' }}
                  >
                    {member.specialization}
                  </span>
                  <button
                    onClick={() => { onClose(); onSelectMember?.(member); }}
                    className="px-4 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border"
                    style={{ background: 'rgba(0,208,132,0.12)', borderColor: 'rgba(0,208,132,0.4)', color: '#00885a' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,208,132,0.22)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,208,132,0.12)'; }}
                  >
                    <Star size={13} />
                    <span>Dossier</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
