import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS, Track } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
}

export default function MusicPlayer({ currentTrackIndex, setCurrentTrackIndex }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
      
      <div className="flex items-center gap-6">
        {/* Cover Art */}
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-24 h-24 flex-shrink-0"
        >
          <div 
            className="absolute inset-0 rounded-2xl blur-lg opacity-40 animate-pulse" 
            style={{ backgroundColor: currentTrack.color }}
          />
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="relative w-full h-full object-cover rounded-2xl border border-white/20"
          />
        </motion.div>

        {/* Info & Controls */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white truncate">{currentTrack.title}</h2>
            <p className="text-sm text-neutral-400 font-medium">{currentTrack.artist}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrev}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Previous track"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>

              <button 
                onClick={handleNext}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Next track"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 group h-1 bg-neutral-800 rounded-full relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-white"
                style={{ width: `${progress}%` }}
                initial={false}
              />
              <div 
                className="absolute inset-y-0 left-0 blur-md opacity-50"
                style={{ width: `${progress}%`, backgroundColor: currentTrack.color }}
              />
            </div>

            <div className="hidden sm:flex items-center gap-2 text-neutral-500">
              <Volume2 className="w-4 h-4" />
              <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-neutral-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
