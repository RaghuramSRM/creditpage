import { useEffect, useRef, useState } from 'react';
import {
  X, ChevronLeft, ChevronRight, Sparkles,
  GitFork, Globe, Globe2, Mail, Phone,
  GraduationCap, Briefcase, Code2, Wrench,
  FolderGit2, Trophy, Star, Heart, Award
} from 'lucide-react';

const colorMap = {
  amber:   { glow: 'rgba(255,199,0,0.40)',   border: '#ffc700', text: '#ffc700', badge: 'rgba(255,199,0,0.12)'  },
  cyan:    { glow: 'rgba(0,240,255,0.40)',   border: '#00f0ff', text: '#00f0ff', badge: 'rgba(0,240,255,0.12)'  },
  purple:  { glow: 'rgba(167,89,255,0.40)',  border: '#a759ff', text: '#c084fc', badge: 'rgba(167,89,255,0.14)' },
  pink:    { glow: 'rgba(255,0,127,0.40)',   border: '#ff007f', text: '#ff6eb4', badge: 'rgba(255,0,127,0.12)'  },
  green:   { glow: 'rgba(0,240,255,0.35)',   border: '#00f0ff', text: '#00f0ff', badge: 'rgba(0,240,255,0.10)'  },
  rose:    { glow: 'rgba(255,0,127,0.35)',   border: '#ff007f', text: '#ff6eb4', badge: 'rgba(255,0,127,0.10)'  },
  indigo:  { glow: 'rgba(147,51,234,0.35)',  border: '#9333ea', text: '#c084fc', badge: 'rgba(147,51,234,0.10)' },
  teal:    { glow: 'rgba(0,240,255,0.30)',   border: '#00f0ff', text: '#00f0ff', badge: 'rgba(0,240,255,0.08)'  },
  emerald: { glow: 'rgba(255,199,0,0.30)',   border: '#ffc700', text: '#ffc700', badge: 'rgba(255,199,0,0.08)'  },
};

function SecHead({ icon, label, color }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: `1px solid ${color}30` }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <h3 className="font-orbitron font-bold text-[0.85rem] tracking-[0.18em] uppercase text-white">{label}</h3>
      <span className="ml-auto font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>//</span>
    </div>
  );
}

function GlassCard({ children, color, className = '', style = {} }) {
  return (
    <div className={`rounded-2xl ${className}`}
      style={{
        padding: '2.5rem',
        background: 'rgba(14,8,32,0.82)',
        border: `1px solid ${color}30`,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 4px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)`,
        ...style,
      }}>
      {children}
    </div>
  );
}

function Pill({ label, color }) {
  return (
    <div className="inline-block font-rajdhani font-semibold text-[0.9rem] px-4 py-1.5 rounded-full border leading-none"
      style={{ background: `${color}14`, borderColor: `${color}40`, color }}>
      {label}
    </div>
  );
}

function SocialBtn({ href, icon, color, title }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" title={title}
      className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer"
      style={{ background: `${color}14`, borderColor: `${color}40`, color }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 18px ${color}60`; e.currentTarget.style.background = `${color}28`; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = `${color}14`; }}>
      {icon}
    </a>
  );
}

/* ═══════════════════════════════════════════════
   RICH PROFILE
═══════════════════════════════════════════════ */
function RichProfile({ member, c, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const initials = member.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const [uploadedImg, setUploadedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedImg(URL.createObjectURL(file));
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10 }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b shrink-0"
        style={{ background: 'rgba(6,2,15,0.97)', borderColor: `${c.border}28`, backdropFilter: 'blur(24px)' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎮</span>
          <div>
            <p className="font-orbitron font-black text-xs tracking-[0.2em] text-white">GAME DEVELOPMENT CLUB</p>
            <p className="font-rajdhani text-[0.62rem] tracking-[0.18em] uppercase mt-0.5"
              style={{ color: 'rgba(255,255,255,0.38)' }}>Play · Learn · Create · Together</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onPrev} disabled={!hasPrev}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-orbitron text-[0.65rem] font-bold uppercase tracking-wider border transition-all disabled:opacity-25 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${c.border}35`, color: 'rgba(255,255,255,0.6)' }}
            id={`prev-hero-${member.id}`}>
            <ChevronLeft size={14} /> Back
          </button>
          <button onClick={onNext} disabled={!hasNext}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-orbitron text-[0.65rem] font-bold uppercase tracking-wider border transition-all disabled:opacity-25 cursor-pointer"
            style={{ background: c.badge, borderColor: c.border, color: c.text, boxShadow: `0 0 18px ${c.glow}` }}
            id={`next-hero-${member.id}`}>
            Next <ChevronRight size={14} />
          </button>
        </div>
        <button onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer text-white"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${c.border}35` }}
          id={`close-dossier-${member.id}`}
          onMouseEnter={e => { e.currentTarget.style.background = c.badge; e.currentTarget.style.borderColor = c.border; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = `${c.border}35`; }}>
          <X size={17} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-[300px] shrink-0 flex flex-col overflow-y-auto modal-scroll border-r"
          style={{ background: 'rgba(6,2,15,0.92)', borderColor: `${c.border}20` }}>

          {/* Photo upload */}
          <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {uploadedImg ? (
              <img src={uploadedImg} alt={member.name} className="w-full h-64 object-cover object-top" />
            ) : (
              <div className="w-full h-64 flex flex-col items-center justify-center gap-4"
                style={{ background: `linear-gradient(160deg, rgba(14,8,32,1) 0%, ${c.badge} 100%)` }}>
                <div className="w-20 h-20 flex items-center justify-center border-2"
                  style={{ 
                    borderColor: `${c.border}60`, 
                    background: c.badge, 
                    boxShadow: `0 0 40px ${c.glow}`,
                    animation: 'blob-morph 10s ease-in-out infinite alternate',
                    animationDelay: `-${(member.id * 1.7) % 10}s`,
                  }}>
                  <span className="font-orbitron font-black text-3xl" style={{ color: c.text }}>{initials}</span>
                </div>
                <span className="font-orbitron text-[0.58rem] tracking-[0.22em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>Click to upload photo</span>
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(6,2,15,0.98) 100%)' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: 'rgba(6,2,15,0.72)', backdropFilter: 'blur(6px)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2"
                style={{ borderColor: c.border, background: c.badge, boxShadow: `0 0 20px ${c.glow}` }}>
                <span className="text-xl">📷</span>
              </div>
              <span className="font-orbitron text-[0.6rem] tracking-widest uppercase" style={{ color: c.text }}>
                {uploadedImg ? 'Change Photo' : 'Upload Photo'}
              </span>
            </div>
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full z-10"
              style={{ background: 'rgba(0,230,90,0.16)', border: '1px solid rgba(0,230,90,0.45)', color: '#00e65a' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e65a] animate-pulse inline-block" />
              <span className="font-rajdhani font-bold text-[0.65rem] tracking-wide">Active Member</span>
            </div>
          </div>

          {/* Identity */}
          <div className="px-6 py-7 space-y-6">
            <div>
              <h1 className="font-orbitron font-black text-[1.3rem] text-white leading-tight">{member.name}</h1>
              <p className="font-rajdhani font-semibold text-[0.95rem] mt-2 leading-snug" style={{ color: c.text }}>
                {member.tagline || member.specialization}
              </p>
              <p className="font-rajdhani text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {member.rollNo} · {member.role}
              </p>
            </div>

            {member.education && (
              <div className="space-y-4">
                <p className="font-orbitron text-[0.58rem] tracking-[0.22em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.28)' }}>Education</p>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${c.border}18`, color: c.text }}>
                    <GraduationCap size={13} />
                  </div>
                  <div>
                    <p className="font-rajdhani font-bold text-sm text-white leading-snug">{member.education.degree}</p>
                    <p className="font-rajdhani text-xs mt-1" style={{ color: 'rgba(255,255,255,0.42)' }}>{member.education.institution}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${c.border}18`, color: c.text }}>
                    <Star size={12} />
                  </div>
                  <div>
                    <p className="font-rajdhani font-bold text-sm text-white">GPA · {member.education.gpa}</p>
                    <p className="font-rajdhani text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.42)' }}>{member.education.duration}</p>
                  </div>
                </div>
              </div>
            )}

            {member.quote && (
              <div className="rounded-xl px-4 py-4"
                style={{ background: `${c.border}0a`, borderLeft: `3px solid ${c.border}80` }}>
                <p className="font-rajdhani italic text-[0.95rem] leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.58)' }}>"{member.quote}"</p>
              </div>
            )}

            <div>
              <p className="font-orbitron text-[0.58rem] tracking-[0.22em] uppercase mb-3"
                style={{ color: 'rgba(255,255,255,0.28)' }}>Connect</p>
              <div className="flex flex-wrap gap-2.5">
                {member.github   && <SocialBtn href={member.github}            icon={<GitFork size={16} />} color={c.border} title="GitHub"   />}
                {member.linkedin && <SocialBtn href={member.linkedin}          icon={<Globe2  size={16} />} color={c.border} title="LinkedIn" />}
                {member.email    && <SocialBtn href={`mailto:${member.email}`} icon={<Mail    size={16} />} color={c.border} title="Email"    />}
                {member.phone    && <SocialBtn href={`tel:${member.phone}`}    icon={<Phone   size={16} />} color={c.border} title="Phone"    />}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 overflow-y-auto modal-scroll" style={{ background: 'rgba(6,2,15,0.75)' }}>
          <div className="flex flex-col" style={{ padding: '3.5rem', gap: '3rem' }}>

            <GlassCard color={c.border}>
              <SecHead icon={<Sparkles size={15} />} label="About Me" color={c.text} />
              <p className="font-rajdhani text-[1rem] leading-[1.85]" style={{ color: 'rgba(255,255,255,0.72)' }}>
                {member.contribution}
              </p>
            </GlassCard>

            <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: '2.5rem' }}>
              <GlassCard color={c.border}>
                <SecHead icon={<Code2 size={15} />} label="Skills" color={c.text} />
                <div className="flex flex-wrap gap-2.5">
                  {(member.skills || []).map(s => <Pill key={s} label={s} color={c.text} />)}
                </div>
              </GlassCard>
              {member.tools && (
                <GlassCard color={c.border}>
                  <SecHead icon={<Wrench size={15} />} label="Tools I Use" color={c.text} />
                  <div className="flex flex-wrap gap-2.5">
                    {member.tools.map(t => <Pill key={t} label={t} color={c.text} />)}
                  </div>
                </GlassCard>
              )}
            </div>

            {member.projects && typeof member.projects[0] === 'object' && (
              <GlassCard color={c.border}>
                <SecHead icon={<FolderGit2 size={15} />} label="Projects / Works" color={c.text} />
                <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: '2.5rem' }}>
                  {member.projects.map(p => (
                    <div key={p.name} className="rounded-2xl p-5 flex gap-4"
                      style={{ background: `${c.border}08`, border: `1px solid ${c.border}25` }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
                        style={{ background: c.badge, border: `1px solid ${c.border}40` }}>🎮</div>
                      <div className="space-y-2 min-w-0">
                        <p className="font-orbitron font-bold text-[0.82rem] text-white leading-snug">{p.name}</p>
                        <p className="font-rajdhani text-[0.95rem] leading-snug" style={{ color: 'rgba(255,255,255,0.58)' }}>{p.desc}</p>
                        <p className="font-rajdhani text-sm font-semibold" style={{ color: c.text }}>{p.tech}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {member.experience && (
              <GlassCard color={c.border}>
                <SecHead icon={<Briefcase size={15} />} label="Experience" color={c.text} />
                <div className="flex flex-col" style={{ gap: '2.5rem' }}>
                  {member.experience.map(e => (
                    <div key={e.company} className="flex gap-5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: c.badge, border: `1px solid ${c.border}40`, color: c.text }}>
                        <Briefcase size={16} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="font-orbitron font-bold text-[0.88rem] text-white">{e.role}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-rajdhani font-bold text-base" style={{ color: c.text }}>{e.company}</span>
                          <span className="font-rajdhani text-sm px-3 py-0.5 rounded-full border"
                            style={{ background: `${c.border}10`, borderColor: `${c.border}35`, color: 'rgba(255,255,255,0.42)' }}>
                            {e.duration}
                          </span>
                        </div>
                        <p className="font-rajdhani text-[0.95rem] leading-[1.75]"
                          style={{ color: 'rgba(255,255,255,0.62)' }}>{e.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: '2.5rem' }}>
              <GlassCard color={c.border}>
                <SecHead icon={<Star size={15} />} label="Club Contribution" color={c.text} />
                <ul className="space-y-4">
                  {(member.clubContributions || [
                    'Driving technical strategy and innovation',
                    'Mentoring members on development & AI',
                    'Running workshops and tech sessions',
                    'Building GDC tech infrastructure',
                  ]).map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-8 flex justify-center shrink-0 pt-2">
                        <span className="w-2 h-2 rounded-full"
                          style={{ background: c.border, boxShadow: `0 0 8px ${c.glow}` }} />
                      </div>
                      <span className="font-rajdhani text-[0.95rem] leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.72)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {member.certifications && (
                <GlassCard color={c.border}>
                  <SecHead icon={<Award size={15} />} label="Certifications" color={c.text} />
                  <div className="space-y-4">
                    {member.certifications.map(cert => (
                      <div key={cert} className="flex items-start gap-3">
                        <div className="w-8 flex justify-center shrink-0 mt-0.5">
                          <span className="text-lg leading-none">🏅</span>
                        </div>
                        <span className="font-rajdhani text-[0.95rem] leading-snug"
                          style={{ color: 'rgba(255,255,255,0.75)' }}>{cert}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {member.achievements && (
                <GlassCard color={c.border}>
                  <SecHead icon={<Trophy size={15} />} label="Achievements" color={c.text} />
                  <div className="space-y-4">
                    {member.achievements.map(a => (
                      <div key={a} className="flex items-start gap-3">
                        <div className="w-8 flex justify-center shrink-0 mt-0.5">
                          <span className="text-lg leading-none">🏆</span>
                        </div>
                        <span className="font-rajdhani text-[0.95rem] leading-snug"
                          style={{ color: 'rgba(255,255,255,0.75)' }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
              {member.interests && (
                <GlassCard color={c.border}>
                  <SecHead icon={<Heart size={15} />} label="Interests" color={c.text} />
                  <div className="flex flex-wrap gap-3">
                    {member.interests.map(i => <Pill key={i} label={i} color={c.text} />)}
                  </div>
                </GlassCard>
              )}
            </div>

            <div style={{ height: 40 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STANDARD PROFILE
═══════════════════════════════════════════════ */
function StandardProfile({ member, c, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const initials = member.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <div className="absolute inset-0 flex flex-col lg:flex-row pt-[57px]" style={{ zIndex: 10 }}>
      <div className="lg:w-[38%] flex flex-col items-center justify-center p-8 lg:border-r shrink-0"
        style={{ borderColor: `${c.border}18`, background: 'rgba(6,2,15,0.65)' }}>
        <div className="flex flex-col items-center w-full max-w-sm p-8 rounded-3xl animate-bounce-in"
          style={{ background: 'rgba(14,8,32,0.90)', border: `1.5px solid ${c.border}`, boxShadow: `0 16px 64px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`, backdropFilter: 'blur(24px)' }}>
          <div className="w-28 h-28 rounded-2xl flex items-center justify-center mb-6 border-2"
            style={{ background: `linear-gradient(135deg, rgba(14,8,32,0.98), ${c.badge})`, borderColor: c.border, boxShadow: `0 0 50px ${c.glow}` }}>
            <span className="font-orbitron font-black text-4xl" style={{ color: c.text }}>{initials}</span>
          </div>
          <h1 className="font-orbitron font-black text-xl tracking-wide text-center text-white leading-tight">
            {member.name.toUpperCase()}
          </h1>
          <p className="font-rajdhani font-bold uppercase tracking-[0.18em] text-sm mt-2 text-center"
            style={{ color: c.text }}>{member.role}</p>
          <p className="font-rajdhani text-sm tracking-widest mt-1 text-center"
            style={{ color: 'rgba(255,255,255,0.35)' }}>{member.rollNo}</p>
          <div className="flex items-center gap-3 mt-7 w-full pt-6"
            style={{ borderTop: `1px solid ${c.border}22` }}>
            <button onClick={onPrev} disabled={!hasPrev}
              className="flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-orbitron text-[0.65rem] font-bold uppercase tracking-wider border transition-all disabled:opacity-25 cursor-pointer"
              style={{ background: c.badge, borderColor: `${c.border}50`, color: c.text }}
              id={`prev-hero-${member.id}`}>
              <ChevronLeft size={14} /> Prev
            </button>
            <button onClick={onNext} disabled={!hasNext}
              className="flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-orbitron text-[0.65rem] font-bold uppercase tracking-wider border transition-all disabled:opacity-25 cursor-pointer"
              style={{ background: c.badge, borderColor: `${c.border}50`, color: c.text }}
              id={`next-hero-${member.id}`}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto modal-scroll flex flex-col"
        style={{ background: 'rgba(6,2,15,0.60)', padding: '4rem', gap: '2.5rem' }}>
        <div className="pb-5" style={{ borderBottom: `1px solid ${c.border}22` }}>
          <p className="font-orbitron text-[0.6rem] tracking-[0.28em] uppercase font-medium"
            style={{ color: 'rgba(255,255,255,0.38)' }}>Division</p>
          <h2 className="font-orbitron font-bold text-3xl mt-2"
            style={{ color: c.text, textShadow: `0 0 40px ${c.glow}` }}>{member.section}</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: '2.5rem' }}>
          <GlassCard color={c.border}>
            <div className="flex items-center gap-3 mb-4">
              <Star size={14} style={{ color: c.text }} />
              <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-white">Specialization</h3>
            </div>
            <p className="font-rajdhani font-semibold text-base leading-relaxed text-white">{member.specialization}</p>
          </GlassCard>
          <GlassCard color={c.border}>
            <div className="flex items-center gap-3 mb-4">
              <FolderGit2 size={14} style={{ color: c.text }} />
              <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-white">Projects</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(member.projects || []).map((proj, i) => (
                <Pill key={typeof proj === 'string' ? proj : (proj.name || i)}
                  label={typeof proj === 'string' ? proj : proj.name} color={c.text} />
              ))}
            </div>
          </GlassCard>
          <GlassCard color={c.border} className="xl:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={14} style={{ color: c.text }} />
              <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-white">Club Contribution</h3>
            </div>
            <p className="font-rajdhani text-[1rem] leading-[1.85]" style={{ color: 'rgba(255,255,255,0.72)' }}>{member.contribution}</p>
          </GlassCard>
          {member.quote && (
            <GlassCard color={c.border} className="xl:col-span-2"
              style={{ borderLeft: `4px solid ${c.border}` }}>
              <div className="flex items-center gap-3 mb-3">
                <span style={{ color: c.text }}>💬</span>
                <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-white">Motto</h3>
              </div>
              <blockquote className="font-rajdhani text-base italic leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)' }}>"{member.quote}"</blockquote>
            </GlassCard>
          )}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export default function CharacterDetails({ member, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const c = colorMap[member?.color] || colorMap.amber;
  const isRich = !!(member?.experience || member?.certifications || member?.achievements);

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft'  && hasPrev) onPrev?.();
      if (e.key === 'ArrowRight' && hasNext) onNext?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!member) return null;

  return (
    <div className="fixed inset-0 overflow-hidden animate-fade-in" style={{ zIndex: 200 }}>
      <div className="absolute inset-0" onClick={onClose}
        style={{ background: 'rgba(4,1,10,0.90)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)' }} />

      {!isRich && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-b"
          style={{ zIndex: 20, background: 'rgba(6,2,15,0.96)', borderColor: `${c.border}30`, backdropFilter: 'blur(24px)' }}>
          <button onClick={onClose} className="btn-ghost flex items-center gap-2 text-sm" id={`back-btn-${member.id}`}>
            <ChevronLeft size={15} /> Back
          </button>
          <div className="font-orbitron text-[0.7rem] tracking-[0.28em] uppercase flex items-center gap-2.5 font-bold" style={{ color: c.text }}>
            <Sparkles size={13} /><span>Member Profile · {member.name.split(' ')[0]}</span><Sparkles size={13} />
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer text-white"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${c.border}40` }} id={`close-dossier-${member.id}`}>
            <X size={17} />
          </button>
        </div>
      )}

      {isRich
        ? <RichProfile   member={member} c={c} onClose={onClose} onPrev={onPrev} onNext={onNext} hasPrev={hasPrev} hasNext={hasNext} />
        : <StandardProfile member={member} c={c} onClose={onClose} onPrev={onPrev} onNext={onNext} hasPrev={hasPrev} hasNext={hasNext} />
      }
    </div>
  );
}
