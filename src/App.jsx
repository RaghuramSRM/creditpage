import { useState } from 'react';
import BackgroundEffects from './components/BackgroundEffects';
import Header from './components/Header';
import CreditsSection from './components/CreditsSection';
import ControlRoomModal from './components/ControlRoomModal';

function App() {
  const [isControlRoomOpen, setIsControlRoomOpen] = useState(false);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'grid'

  return (
    <div className="relative min-h-screen bg-[#0b0419] text-white selection:bg-[#ff007f] selection:text-white">
      {/* Background Animated Synthwave & Particle Effects */}
      <BackgroundEffects />

      {/* Main Foreground Content */}
      <div className="relative" style={{ zIndex: 10 }}>
        <Header
          onOpenControlRoom={() => setIsControlRoomOpen(true)}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <CreditsSection viewMode={viewMode} />
      </div>

      {/* Credits Control Center Modal */}
      <ControlRoomModal
        isOpen={isControlRoomOpen}
        onClose={() => setIsControlRoomOpen(false)}
      />
    </div>
  );
}

export default App;
