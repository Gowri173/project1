import { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { TRACKS } from './constants';
import { motion } from 'motion/react';
import { Disc, Activity, Terminal } from 'lucide-react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full blur-[120px]"
          style={{ backgroundColor: `${currentTrack.color}20` }}
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full blur-[120px]"
          style={{ backgroundColor: `${currentTrack.color}15` }}
        />
      </div>

      {/* Navigation / Header */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl">
             <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Neon Snake</h1>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Protocol v3.0 // Synthwave Edition</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
              <Terminal className="w-3 h-3 text-neutral-500" />
              <span className="text-[10px] font-mono text-neutral-400">SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
           </div>
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">
        {/* Game Section */}
        <section className="w-full flex-1 flex flex-col items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[500px]"
          >
            <SnakeGame />
          </motion.div>
        </section>

        {/* Music Player Section (Floating Bottom) */}
        <div className="fixed bottom-0 left-0 w-full p-6 md:p-12 z-50">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MusicPlayer 
              currentTrackIndex={currentTrackIndex}
              setCurrentTrackIndex={setCurrentTrackIndex}
            />
          </motion.div>
          
          <div className="flex justify-center mt-4">
             <p className="text-[10px] text-neutral-600 uppercase tracking-[0.3em] font-medium flex items-center gap-2">
                <Disc className="w-3 h-3 animate-spin-slow" /> Playing: {currentTrack.title} — {currentTrack.artist}
             </p>
          </div>
        </div>
      </main>

      {/* Decorative Side Elements */}
      <div className="hidden xl:block fixed left-12 top-1/2 -translate-y-1/2 vertical-text opacity-20 pointer-events-none">
        <span className="text-[10px] uppercase font-black tracking-[0.5em] text-white">REACTIVE NEON ENGINE // EST. 2026</span>
      </div>
      <div className="hidden xl:block fixed right-12 top-1/2 -translate-y-1/2 vertical-text opacity-20 rotate-180 pointer-events-none">
        <span className="text-[10px] uppercase font-black tracking-[0.5em] text-white">LOW LATENCY SYNTHESIS // DIGITAL VOID</span>
      </div>
    </div>
  );
}

// Add these to index.css if not using tailwind 4 theme block, but I'll add them to the App file for quick styling
const style = document.createElement('style');
style.textContent = `
  .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
`;
document.head.append(style);
