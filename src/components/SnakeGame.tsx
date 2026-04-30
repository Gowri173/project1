import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy } from 'lucide-react';
import { GAME_CONFIG } from '../constants';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
        y: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall Collision
      if (
        newHead.x < 0 || 
        newHead.x >= GAME_CONFIG.GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GAME_CONFIG.GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self Collision
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food Collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      const speed = Math.max(50, GAME_CONFIG.INITIAL_SPEED - (score / 10) * GAME_CONFIG.SPEED_INCREMENT);
      gameLoopRef.current = setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isGameOver, isPaused, score]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GAME_CONFIG.GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GAME_CONFIG.GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * size);
        ctx.lineTo(canvas.width, i * size);
        ctx.stroke();
    }

    // Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff3cc7';
    ctx.fillStyle = '#ff3cc7';
    ctx.beginPath();
    ctx.roundRect(food.x * size + 2, food.y * size + 2, size - 4, size - 4, 4);
    ctx.fill();

    // Snake
    snake.forEach((segment, i) => {
      ctx.shadowBlur = i === 0 ? 20 : 10;
      ctx.shadowColor = '#00f2ff';
      ctx.fillStyle = i === 0 ? '#00f2ff' : '#0088aa';
      ctx.beginPath();
      ctx.roundRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2, 6);
      ctx.fill();
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group">
      {/* HUD Bar */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Score</span>
            <span className="text-2xl font-black text-white font-mono">{score.toString().padStart(4, '0')}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1">
               <Trophy className="w-3 h-3 text-yellow-500" /> High Score
            </span>
            <span className="text-2xl font-black text-white/50 font-mono">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative aspect-square w-full max-w-[500px] bg-neutral-900 rounded-2xl border-4 border-neutral-800 shadow-2xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full"
        />

        {/* Overlay Screens */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-center items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <div className="text-center p-8">
                {isGameOver ? (
                  <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
                    <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">System Offline</h2>
                    <p className="text-neutral-400 mb-8 font-medium">Final Integrity Check: {score}</p>
                    <button 
                      onClick={resetGame}
                      className="group flex items-center gap-2 mx-auto px-8 py-3 bg-[#00f2ff] text-black rounded-full font-bold transition-all hover:scale-105 active:scale-95"
                    >
                      <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                      Reboot System
                    </button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                    <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-widest">Standby Mode</h2>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors"
                    >
                      Initialize
                    </button>
                    <p className="mt-4 text-[10px] text-neutral-500 uppercase tracking-widest">Press Space to Resume</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Hint */}
      <div className="mt-6 flex justify-center gap-8">
         <div className="flex flex-col items-center gap-1 opacity-40">
            <div className="flex gap-1 mb-1">
                <div className="w-6 h-6 border border-white/20 rounded flex items-center justify-center">W</div>
            </div>
            <div className="flex gap-1">
                <div className="w-6 h-6 border border-white/20 rounded flex items-center justify-center">A</div>
                <div className="w-6 h-6 border border-white/20 rounded flex items-center justify-center">S</div>
                <div className="w-6 h-6 border border-white/20 rounded flex items-center justify-center">D</div>
            </div>
            <span className="text-[10px] uppercase font-bold mt-2">Navigate</span>
         </div>
         <div className="flex flex-col items-center gap-1 opacity-40">
            <div className="w-20 h-6 border border-white/20 rounded flex items-center justify-center text-[10px] uppercase font-bold">Space</div>
            <span className="text-[10px] uppercase font-bold mt-2">Pause</span>
         </div>
      </div>
    </div>
  );
}
