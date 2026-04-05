import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Trophy, Flame, Heart, ArrowRight, FastForward, Skull, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../lib/sounds';

const WORD_PAIRS = [
  { pt: 'Maçã', en: 'Apple' },
  { pt: 'Cachorro', en: 'Dog' },
  { pt: 'Gato', en: 'Cat' },
  { pt: 'Livro', en: 'Book' },
  { pt: 'Água', en: 'Water' },
  { pt: 'Fogo', en: 'Fire' },
  { pt: 'Terra', en: 'Earth' },
  { pt: 'Céu', en: 'Sky' },
  { pt: 'Carro', en: 'Car' },
  { pt: 'Casa', en: 'House' },
  { pt: 'Sol', en: 'Sun' },
  { pt: 'Lua', en: 'Moon' },
  { pt: 'Tempo', en: 'Time' },
  { pt: 'Amigo', en: 'Friend' },
  { pt: 'Feliz', en: 'Happy' },
  { pt: 'Triste', en: 'Sad' },
  { pt: 'Rápido', en: 'Fast' },
  { pt: 'Lento', en: 'Slow' },
  { pt: 'Comida', en: 'Food' },
  { pt: 'Bebida', en: 'Drink' },
];

interface RunnerGameProps {
  onClose: (score: number, xp: number) => void;
  bestScore: number;
  streakMultiplier?: number;
  eventMultiplier?: number;
}

export const RunnerGame: React.FC<RunnerGameProps> = ({ 
  onClose, 
  bestScore,
  streakMultiplier = 1,
  eventMultiplier = 1
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [duration, setDuration] = useState(4000); // Starts at 4s
  const [wordKey, setWordKey] = useState(0);
  
  const [currentWord, setCurrentWord] = useState(WORD_PAIRS[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, x: number, y: number, color: string}[]>([]);

  const generateOptions = useCallback((correctWord: typeof WORD_PAIRS[0]) => {
    const wrongOptions = WORD_PAIRS
      .filter(w => w.en !== correctWord.en)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.en);
    
    const allOptions = [...wrongOptions, correctWord.en].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  }, []);

  const nextRound = useCallback(() => {
    const nextWord = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    setCurrentWord(nextWord);
    generateOptions(nextWord);
    setSelectedOption(null);
    setIsCorrect(null);
    setWordKey(prev => prev + 1);
  }, [generateOptions]);

  // Intro Countdown
  useEffect(() => {
    if (gameState === 'intro') {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
          playSound('BUTTON');
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setGameState('playing');
        playSound('VICTORY');
        nextRound();
      }
    }
  }, [countdown, gameState, nextRound]);

  // Per-word Timer
  useEffect(() => {
    if (gameState === 'playing' && !selectedOption) {
      const timer = setTimeout(() => {
        handleWrongAnswer(true);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [wordKey, gameState, selectedOption, duration]);

  const handleWrongAnswer = (isTimeout = false) => {
    setIsCorrect(false);
    setCombo(0);
    setLives(l => l - 1);
    
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

    if (lives <= 1) {
      setGameState('gameover');
      playSound('VICTORY');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#EF4444', '#000000']
      });
    } else {
      setTimeout(nextRound, 800);
    }
  };

  const handleTap = (option: string, e: React.MouseEvent) => {
    if (selectedOption || gameState !== 'playing') return;

    setSelectedOption(option);
    const correct = option === currentWord.en;

    if (correct) {
      setIsCorrect(true);
      playSound('XP');
      
      // Combo logic
      const comboBonus = Math.floor(combo / 5); // x1.2, x1.4, etc.
      const comboMultiplier = 1 + (comboBonus * 0.2);
      
      const basePoints = 10;
      const points = Math.floor(basePoints * comboMultiplier);
      
      setScore(s => s + points);
      setCombo(c => c + 1);
      
      if (combo > 0 && combo % 5 === 0) {
        playSound('COMBO');
      }

      // Increase speed (decrease duration) - min 800ms
      setDuration(d => Math.max(800, d - 100));

      if (navigator.vibrate) navigator.vibrate([50]);

      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const newText = {
        id: Date.now(),
        text: `+${points}`,
        x: rect.left + rect.width / 2,
        y: rect.top,
        color: '#FFD400'
      };
      setFloatingTexts(prev => [...prev, newText]);
      setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== newText.id)), 1000);

      setTimeout(nextRound, 400);
    } else {
      handleWrongAnswer(false);
    }
  };

  const baseXP = Math.floor(score / 5);
  const xpGained = Math.floor(baseXP * streakMultiplier * eventMultiplier);
  const isNewBest = score > bestScore && score > 0;

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FFD400]/10 rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,212,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,212,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        
        {/* Speed lines effect when duration is low */}
        {duration < 2000 && gameState === 'playing' && (
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAxIDAuNSIgbnVtT2N0YXZlcz0iMSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] mix-blend-overlay animate-[slideDown_1s_linear_infinite]" />
        )}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i}
              animate={i >= lives ? { scale: 0.5, opacity: 0.3 } : { scale: 1, opacity: 1 }}
            >
              <Heart 
                size={24} 
                className={i < lives ? "text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "text-white/20"} 
              />
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#FFD400]/10 px-4 py-2 rounded-full border border-[#FFD400]/20">
            <Trophy size={16} className="text-[#FFD400]" />
            <span className="text-[#FFD400] font-black text-lg">{score}</span>
          </div>
        </div>
      </div>

      {/* Floating Texts */}
      <AnimatePresence>
        {floatingTexts.map(ft => (
          <motion.div
            key={ft.id}
            initial={{ opacity: 1, y: ft.y, x: ft.x - 20, scale: 0.5 }}
            animate={{ opacity: 0, y: ft.y - 100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed z-50 font-black text-2xl pointer-events-none"
            style={{ color: ft.color, textShadow: `0 0 15px ${ft.color}` }}
          >
            {ft.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 relative z-10 flex flex-col">
        
        {/* INTRO STATE */}
        <AnimatePresence>
          {gameState === 'intro' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <FastForward size={64} className="text-[#FFD400] mb-8 opacity-50" />
              <h2 className="text-white font-black text-2xl uppercase tracking-widest mb-2 text-center">LinguaGo<br/>Runner</h2>
              <p className="text-white/50 font-bold text-sm uppercase tracking-widest mb-8">Sobreviva o máximo que puder</p>
              <motion.div 
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-[#FFD400] font-black text-8xl glow-text-yellow"
              >
                {countdown > 0 ? countdown : 'GO!'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PLAYING STATE */}
        <AnimatePresence>
          {gameState === 'playing' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* HUD */}
              <div className="px-6 flex justify-between items-end mb-8">
                <div className="flex flex-col">
                  <span className="text-white/40 font-bold text-xs uppercase tracking-widest mb-1">Velocidade</span>
                  <div className="flex items-center gap-2">
                    <FastForward size={20} className={duration < 2000 ? "text-[#FFD400] animate-pulse" : "text-white/50"} />
                    <span className={`font-black text-2xl ${duration < 2000 ? "text-[#FFD400] glow-text-yellow" : "text-white"}`}>
                      {Math.round((5000 / duration) * 10) / 10}x
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-white/40 font-bold text-xs uppercase tracking-widest mb-1">Combo</span>
                  <div className="flex items-center gap-1">
                    <Flame size={20} className={combo > 2 ? "text-orange-500" : "text-white/20"} />
                    <span className={`font-black text-3xl ${combo > 2 ? "text-orange-500 glow-text-orange" : "text-white/50"}`}>
                      x{combo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar (Timer per word) */}
              <div className="px-6 mb-12">
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    key={wordKey}
                    className={`h-full ${duration < 2000 ? 'bg-red-500 glow-red' : 'bg-[#FFD400] glow-yellow'}`}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration / 1000, ease: "linear" }}
                  />
                </div>
              </div>

              {/* Target Word */}
              <div className="flex-1 flex items-center justify-center px-6">
                <motion.div 
                  key={wordKey}
                  initial={{ y: -50, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <span className="text-[#FFD400] font-bold text-sm uppercase tracking-widest mb-4 block">Traduza rápido:</span>
                  <h1 className="text-white font-black text-6xl tracking-tight drop-shadow-2xl">
                    {currentWord.pt}
                  </h1>
                </motion.div>
              </div>

              {/* Options Grid */}
              <div className="p-6 grid grid-cols-2 gap-4 pb-12">
                {options.map((option, index) => {
                  const isSelected = selectedOption === option;
                  const isCorrectOption = option === currentWord.en;
                  
                  let btnClass = "bg-[#111] border-white/10 text-white hover:bg-[#222]";
                  if (isSelected) {
                    if (isCorrect) {
                      btnClass = "bg-[#FFD400] border-[#FFD400] text-black glow-yellow shadow-[0_0_30px_rgba(255,212,0,0.5)]";
                    } else {
                      btnClass = "bg-red-500 border-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-[shake_0.5s_ease-in-out]";
                    }
                  } else if (selectedOption && isCorrectOption) {
                    btnClass = "bg-[#FFD400]/20 border-[#FFD400] text-[#FFD400]";
                  } else if (selectedOption) {
                    btnClass = "bg-[#111] border-white/5 text-white/30 opacity-50";
                  }

                  return (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={!selectedOption ? { scale: 1.05 } : {}}
                      whileTap={!selectedOption ? { scale: 0.95 } : {}}
                      onClick={(e) => handleTap(option, e)}
                      disabled={!!selectedOption}
                      className={`relative p-6 rounded-2xl border-2 font-black text-xl tracking-wide transition-all duration-200 overflow-hidden ${btnClass}`}
                    >
                      <span className="relative z-10">{option}</span>
                      {isSelected && isCorrect && (
                        <motion.div 
                          className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full"
                          animate={{ translateX: ['-100%', '200%'] }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GAME OVER STATE */}
        <AnimatePresence>
          {gameState === 'gameover' && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#050505]/90 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(239,68,68,0.5)]"
              >
                <Skull size={48} className="text-[#050505]" />
              </motion.div>
              
              <h2 className="text-white font-black text-4xl uppercase tracking-widest mb-2">Fim de Jogo</h2>
              <p className="text-white/50 font-bold text-sm uppercase tracking-widest mb-8">
                {isNewBest ? 'Novo Recorde!' : 'Boa tentativa!'}
              </p>
              
              <div className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-sm mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD400]/10 blur-[50px]" />
                
                <div className="flex flex-col items-center mb-6">
                  <span className="text-[#FFD400] font-bold text-xs uppercase tracking-widest mb-2">Pontuação Final</span>
                  <span className="text-white font-black text-6xl glow-text-yellow">{score}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t border-white/5">
                  <span className="text-white/50 font-bold text-sm">Melhor Score</span>
                  <div className="flex items-center gap-1 text-[#FFD400]">
                    <Trophy size={16} />
                    <span className="font-black text-lg">{Math.max(score, bestScore)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t border-white/5">
                  <span className="text-white/50 font-bold text-sm">XP Ganho</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[#FFD400] font-black text-lg">+{xpGained} XP</span>
                    {(streakMultiplier > 1 || eventMultiplier > 1) && (
                      <div className="flex gap-2 mt-1">
                        {streakMultiplier > 1 && (
                          <div className="flex items-center gap-1 text-orange-500 text-[10px] font-bold">
                            <Flame size={10} /> x{streakMultiplier}
                          </div>
                        )}
                        {eventMultiplier > 1 && (
                          <div className="flex items-center gap-1 text-blue-400 text-[10px] font-bold">
                            <Star size={10} /> x{eventMultiplier}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full max-w-sm flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setGameState('intro');
                    setCountdown(3);
                    setScore(0);
                    setCombo(0);
                    setLives(3);
                    setDuration(4000);
                  }}
                  className="w-full bg-[#FFD400] text-[#050505] font-black text-lg py-5 rounded-2xl uppercase tracking-widest shadow-[0_10px_0_#B39500] flex items-center justify-center gap-2"
                >
                  Repetir <Zap size={20} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onClose(score, xpGained)}
                  className="w-full bg-[#111] text-white font-black text-lg py-5 rounded-2xl uppercase tracking-widest border-2 border-white/10 flex items-center justify-center gap-2"
                >
                  Voltar <ArrowRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-2deg); }
          50% { transform: translateX(5px) rotate(2deg); }
          75% { transform: translateX(-5px) rotate(-2deg); }
        }
        @keyframes slideDown {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }
        .glow-text-orange { text-shadow: 0 0 15px rgba(249,115,22,0.6); }
        .glow-red { box-shadow: 0 0 15px rgba(239,68,68,0.8); }
      `}</style>
    </div>
  );
};
