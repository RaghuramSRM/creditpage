import { Crown, Zap, Shield, Sparkles } from 'lucide-react';
import CharacterCard from './CharacterCard';
import membersData from '../data/members';

function SectionPill({ icon, label, color, bg }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-orbitron text-[0.55rem] font-bold uppercase tracking-[0.18em] mb-3"
      style={{
        background: bg || `${color}18`,
        border: `1px solid ${color}`,
        color,
        boxShadow: `0 4px 18px ${color}40`,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function GroupHeader({ icon, label, color }) {
  return (
    <span
      className="font-orbitron text-[0.55rem] tracking-wider font-bold mb-2 uppercase flex items-center gap-1.5"
      style={{ color }}
    >
      {icon} {label}
    </span>
  );
}

function Panel({ children, borderColor }) {
  return (
    <div
      className="rounded-2xl p-3 flex flex-col items-center space-y-3"
      style={{
        background: 'rgba(13, 9, 35, 0.72)',
        border: `1px solid ${borderColor}55`,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 8px 40px ${borderColor}25, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {children}
    </div>
  );
}

export default function HierarchicalTree({ onSelectMember, selectedMemberId }) {
  const president   = membersData.find(m => m.role === 'President');
  const vps         = membersData.filter(m => m.role === 'Vice President');
  const secretaries = membersData.filter(m => m.role.includes('Secretary'));
  const treasurers  = membersData.filter(m => m.role.includes('Treasurer'));

  const eventLead = membersData.find(m => m.role === 'Lead Event Coordinator');
  const eventTeam = membersData.filter(m => m.section === 'Event Coordinators' && m.id !== eventLead?.id);

  const techLead = membersData.find(m => m.role === 'Tech Team Lead');
  const techTeam = membersData.filter(m => m.section === 'Tech Team' && m.id !== techLead?.id);

  const execLead = membersData.find(m => m.role === 'Executive Lead');
  const execTeam = membersData.filter(m => m.section === 'Executive Members' && m.id !== execLead?.id);

  const Connector = () => (
    <div className="flex flex-col items-center my-0.5">
      <div
        className="w-0.5 h-6"
        style={{ background: 'linear-gradient(180deg, #ffc700, #ff007f)' }}
      />
    </div>
  );

  const LeadBadge = ({ color, label }) => (
    <span
      className="font-orbitron text-[0.6rem] font-bold uppercase tracking-wider mb-2 px-3 py-0.5 rounded-full border"
      style={{ color, background: `${color}15`, borderColor: `${color}55` }}
    >
      {label}
    </span>
  );

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 py-4 space-y-4">

      {/* ── Tier 1: President ── */}
      <div className="flex flex-col items-center">
        <SectionPill icon={<Crown size={13} />} label="President" color="#ffc700" bg="rgba(255,199,0,0.12)" />
        {president && (
          <CharacterCard
            member={president}
            isSelected={selectedMemberId === president.id}
            onClick={() => onSelectMember(president)}
          />
        )}
        <Connector />
      </div>

      {/* ── Tier 2: Council ── */}
      <Panel borderColor="#ffc700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full items-start">

          <div className="flex flex-col items-center p-4 rounded-2xl" style={{ background: 'rgba(255,199,0,0.06)', border: '1px solid rgba(255,199,0,0.18)' }}>
            <GroupHeader icon={<Shield size={13} />} label="Vice Presidents" color="#ffc700" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {vps.map((vp, i) => (
                <CharacterCard key={vp.id} member={vp} index={i+1} isSelected={selectedMemberId === vp.id} onClick={() => onSelectMember(vp)} />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl" style={{ background: 'rgba(147,51,234,0.08)', border: '1px solid rgba(147,51,234,0.22)' }}>
            <GroupHeader icon={<Sparkles size={13} />} label="Secretaries" color="#a855f7" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {secretaries.map((sec, i) => (
                <CharacterCard key={sec.id} member={sec} index={i+3} isSelected={selectedMemberId === sec.id} onClick={() => onSelectMember(sec)} />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl" style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.18)' }}>
            <GroupHeader icon={<Zap size={13} />} label="Treasurers" color="#00f0ff" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {treasurers.map((tr, i) => (
                <CharacterCard key={tr.id} member={tr} index={i+5} isSelected={selectedMemberId === tr.id} onClick={() => onSelectMember(tr)} />
              ))}
            </div>
          </div>

        </div>
      </Panel>

      <div className="flex flex-col items-center w-full">
        <div className="w-0.5 h-5" style={{ background: 'linear-gradient(180deg, #ffc700, #ff007f)' }} />
        <div
          className="px-5 py-1.5 rounded-full font-orbitron text-[0.62rem] uppercase tracking-[0.2em] font-bold border"
          style={{ background: 'rgba(255,199,0,0.12)', borderColor: 'rgba(255,199,0,0.5)', color: '#ffc700', backdropFilter: 'blur(12px)', boxShadow: '0 0 20px rgba(255,199,0,0.3)' }}
        >
          Divisions
        </div>
        <div className="w-0.5 h-4" style={{ background: '#ff007f' }} />
        
        {/* Horizontal Branching for desktop */}
        <div className="hidden lg:block w-[66.66%] h-0.5" style={{ background: '#ff007f' }} />
        <div className="hidden lg:flex w-[66.66%] justify-between">
          <div className="w-0.5 h-4" style={{ background: '#ff007f' }} />
          <div className="w-0.5 h-4" style={{ background: '#ff007f' }} />
          <div className="w-0.5 h-4" style={{ background: '#ff007f' }} />
        </div>
      </div>

      {/* ── Tier 3: Divisions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Event Operations */}
        <Panel borderColor="#00f0ff">
          <div className="text-center">
            <SectionPill icon="🎪" label="Event Operations Squad" color="#00f0ff" bg="rgba(0,240,255,0.10)" />
            <span className="font-rajdhani text-xs block -mt-3 mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Logistics, Marketing & Workshops</span>
          </div>
          {eventLead && (
            <div className="w-full flex flex-col items-center">
              <LeadBadge color="#00f0ff" label="Division Lead" />
              <CharacterCard member={eventLead} isSelected={selectedMemberId === eventLead.id} onClick={() => onSelectMember(eventLead)} />
              <div className="w-0.5 h-5 my-2" style={{ background: 'rgba(0,240,255,0.5)' }} />
            </div>
          )}
          <div className="w-full grid grid-cols-2 gap-3 pt-3" style={{ borderTop: '1px solid rgba(0,240,255,0.18)' }}>
            {eventTeam.map((m, i) => (
              <div key={m.id} className={eventTeam.length % 2 !== 0 && i === eventTeam.length - 1 ? "col-span-2 flex justify-center" : ""}>
                <div className={eventTeam.length % 2 !== 0 && i === eventTeam.length - 1 ? "w-1/2" : "w-full"}>
                  <CharacterCard member={m} index={i+8} isSelected={selectedMemberId === m.id} onClick={() => onSelectMember(m)} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Tech & Engineering */}
        <Panel borderColor="#9333ea">
          <div className="text-center">
            <SectionPill icon="⚡" label="Tech & Engineering Squad" color="#a855f7" bg="rgba(147,51,234,0.12)" />
            <span className="font-rajdhani text-xs block -mt-3 mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Game Engine, Frontend & QA</span>
          </div>
          {techLead && (
            <div className="w-full flex flex-col items-center">
              <LeadBadge color="#a855f7" label="Division Lead" />
              <CharacterCard member={techLead} isSelected={selectedMemberId === techLead.id} onClick={() => onSelectMember(techLead)} />
              <div className="w-0.5 h-5 my-2" style={{ background: 'rgba(147,51,234,0.5)' }} />
            </div>
          )}
          <div className="w-full grid grid-cols-2 gap-3 pt-3" style={{ borderTop: '1px solid rgba(147,51,234,0.2)' }}>
            {techTeam.map((m, i) => (
              <div key={m.id} className={techTeam.length % 2 !== 0 && i === techTeam.length - 1 ? "col-span-2 flex justify-center" : ""}>
                <div className={techTeam.length % 2 !== 0 && i === techTeam.length - 1 ? "w-1/2" : "w-full"}>
                  <CharacterCard member={m} index={i+16} isSelected={selectedMemberId === m.id} onClick={() => onSelectMember(m)} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Executive & Creative */}
        <Panel borderColor="#ff007f">
          <div className="text-center">
            <SectionPill icon="🏆" label="Executive & Creative Squad" color="#ff007f" bg="rgba(255,0,127,0.10)" />
            <span className="font-rajdhani text-xs block -mt-3 mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Media, Art Direction & Community</span>
          </div>
          {execLead && (
            <div className="w-full flex flex-col items-center">
              <LeadBadge color="#ff007f" label="Division Lead" />
              <CharacterCard member={execLead} isSelected={selectedMemberId === execLead.id} onClick={() => onSelectMember(execLead)} />
              <div className="w-0.5 h-5 my-2" style={{ background: 'rgba(255,0,127,0.5)' }} />
            </div>
          )}
          <div className="w-full grid grid-cols-2 gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,0,127,0.18)' }}>
            {execTeam.map((m, i) => (
              <div key={m.id} className={execTeam.length % 2 !== 0 && i === execTeam.length - 1 ? "col-span-2 flex justify-center" : ""}>
                <div className={execTeam.length % 2 !== 0 && i === execTeam.length - 1 ? "w-1/2" : "w-full"}>
                  <CharacterCard member={m} index={i+22} isSelected={selectedMemberId === m.id} onClick={() => onSelectMember(m)} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

      </div>
    </div>
  );
}
