// Synthwave gaming colour map
const colorMap = {
  amber:   { border: '#ffc700', glow: 'rgba(255,199,0,0.45)',   text: '#ffc700', bg: 'rgba(255,199,0,0.10)'  },
  pink:    { border: '#ff007f', glow: 'rgba(255,0,127,0.45)',   text: '#ff007f', bg: 'rgba(255,0,127,0.10)' },
  cyan:    { border: '#00f0ff', glow: 'rgba(0,240,255,0.45)',   text: '#00f0ff', bg: 'rgba(0,240,255,0.10)'  },
  purple:  { border: '#9333ea', glow: 'rgba(147,51,234,0.45)',  text: '#a855f7', bg: 'rgba(147,51,234,0.10)' },
  green:   { border: '#00f0ff', glow: 'rgba(0,240,255,0.35)',   text: '#00f0ff', bg: 'rgba(0,240,255,0.08)'  },
  rose:    { border: '#ff007f', glow: 'rgba(255,0,127,0.40)',   text: '#ff007f', bg: 'rgba(255,0,127,0.08)' },
  indigo:  { border: '#9333ea', glow: 'rgba(147,51,234,0.40)',  text: '#a855f7', bg: 'rgba(147,51,234,0.08)' },
  teal:    { border: '#00f0ff', glow: 'rgba(0,240,255,0.35)',   text: '#00f0ff', bg: 'rgba(0,240,255,0.08)'  },
  emerald: { border: '#ffc700', glow: 'rgba(255,199,0,0.35)',   text: '#ffc700', bg: 'rgba(255,199,0,0.08)'  },
};

const sectionIcons = {
  'Leadership':         '👑',
  'Event Coordinators': '🎪',
  'Tech Team':          '⚡',
  'Executive Members':  '🏆',
};

export default function CharacterCard({ member, isSelected, onClick }) {
  const c        = colorMap[member.color] || colorMap.amber;
  const initials = member.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const icon     = sectionIcons[member.section] || '✦';

  return (
    <article
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      role="button"
      tabIndex={0}
      aria-label={`View ${member.name}'s profile`}
      className={`flex flex-col items-center w-full max-w-[200px] mx-auto group cursor-pointer active:scale-95 shimmer-wrap ${
        isSelected ? 'member-card selected' : 'member-card'
      }`}
      id={`member-card-${member.id}`}
      style={isSelected ? { boxShadow: `0 0 0 2px ${c.border}, 0 14px 48px ${c.glow}` } : {}}
    >
      <div className="w-full px-2 py-3 flex flex-col items-center">
        {/* Section Icon */}
        <div className="w-full flex justify-start mb-1">
          <span className="text-xs">{icon}</span>
        </div>

        {/* Avatar */}
        <div className="relative mb-2">
          <div
            className="w-14 h-14 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 relative z-10"
            style={{
              background: `linear-gradient(135deg, rgba(13,10,28,0.9), ${c.bg})`,
              border: `2px solid ${c.border}`,
              boxShadow: `0 4px 20px ${c.glow}`,
            }}
          >
            <span className="font-orbitron font-black text-lg" style={{ color: c.text }}>
              {initials}
            </span>
          </div>
          {/* glow ring */}
          <div
            className="absolute inset-0 rounded-2xl blur-xl pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-300"
            style={{ background: c.border }}
          />
        </div>

        {/* Name */}
        <h3
          className="font-orbitron font-bold text-center leading-snug w-full truncate px-1"
          style={{ fontSize: '0.68rem', letterSpacing: '0.03em', color: '#ffffff' }}
          title={member.name}
        >
          {member.name}
        </h3>

        {/* Role */}
        <p
          className="font-rajdhani font-semibold uppercase tracking-wider text-center mt-0.5 truncate w-full px-1"
          style={{ fontSize: '0.6rem', color: c.text }}
        >
          {member.role}
        </p>

        {/* Roll No */}
        <p
          className="font-rajdhani text-center mt-0.5 font-medium leading-none"
          style={{ fontSize: '0.55rem', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)' }}
        >
          {member.rollNo}
        </p>
      </div>
    </article>
  );
}
