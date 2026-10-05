import { useState } from 'react';
import CharacterCard from './CharacterCard';
import CharacterDetails from './CharacterDetails';
import HierarchicalTree from './HierarchicalTree';
import members from '../data/members';

const sections = ['All', 'Leadership', 'Event Coordinators', 'Tech Team', 'Executive Members'];

export default function CreditsSection({ viewMode }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [activeSection, setActiveSection] = useState('All');

  const selectedMember = selectedIdx !== null ? members[selectedIdx] : null;

  const handleSelect = (member) => {
    const idx = members.findIndex(m => m.id === member.id);
    setSelectedIdx(idx);
  };
  const handleClose = () => setSelectedIdx(null);
  const handlePrev  = () => setSelectedIdx(i => (i > 0 ? i - 1 : i));
  const handleNext  = () => setSelectedIdx(i => (i < members.length - 1 ? i + 1 : i));

  const filteredMembers = activeSection === 'All'
    ? members
    : members.filter(m => m.section === activeSection);

  return (
    <section id="credits-section" className="relative px-4 pb-24" style={{ zIndex: 10 }}>

      {viewMode === 'tree' ? (
        <div key="tree-view" className="animate-fade-in">
          <HierarchicalTree
            onSelectMember={handleSelect}
            selectedMemberId={selectedMember?.id}
          />
        </div>
      ) : (
        <div key="grid-view" className="animate-fade-in">

          {/* Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2.5 mb-10 max-w-4xl mx-auto">
            {sections.map(sec => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-5 py-2 rounded-xl font-orbitron text-[0.65rem] font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeSection === sec
                    ? 'tab-active'
                    : 'btn-ghost'
                }`}
                id={`filter-${sec.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div
            className="w-full max-w-[1700px] mx-auto px-4 md:px-8 grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
          >
            {filteredMembers.map((member, index) => (
              <div key={member.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.04}s` }}>
                <CharacterCard
                  member={member}
                  isSelected={selectedIdx !== null && members[selectedIdx]?.id === member.id}
                  onClick={() => handleSelect(member)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMember && (
        <CharacterDetails
          key={selectedMember.id}
          member={selectedMember}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < members.length - 1}
        />
      )}
    </section>
  );
}
