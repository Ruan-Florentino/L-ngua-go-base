import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Trophy, Timer, Flame, MousePointerClick, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

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
];

interface TapGameProps {
  onClose: (score: number) => void;
}

export const TapGame: React.FC<TapGameProps> = ({ onClose }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const [currentWord, setCurrentWord] = useState(WORD_PAIRS[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, x: number, y: number}[]>([]);

  // Generate options for a word
  const generateOptions = useCallback((correctWord: typeof WORD_PAIRS[0]) => {
    const wrongOptions = WORD_PAIRS
      .filter(w => w.en !== correctWord.en)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.en);
    
    const allOptions = [...wrongOptions, correctWord.en].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  }, []);

  // Next round
  const nextRound = useCallback(() => {
    const nextWord = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    setCurrentWord(nextWord);
    generateOptions(nextWord);
    setSelectedOption(null);
    setIsCorrect(null);
  }, [generateOptions]);

  // Intro Countdown
  useEffect(() => {
    if (gameState === 'intro') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameState('playing');
        nextRound();
      }
    }
  }, [countdown, gameState, nextRound]);

  // Game Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('gameover');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD400', '#FFFFFF', '#FFA500']
      });
    }
  }, [timeLeft, gameState]);

  const handleTap = (option: string, e: React.MouseEvent) => {
    if (selectedOption || gameState !== 'playing') return;

    setSelectedOption(option);
    const correct = option === currentWord.en;
    setIsCorrect(correct);

    if (navigator.vibrate) {
      navigator.vibrate(correct ? [50] : [50, 50, 50]);
    }

    if (correct) {
      const points = 10 + (combo * 2);
      setScore(s => s + points);
      setCombo(c => c + 1);
      
      // Add floating text
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const newText = {
        id: Date.now(),
        text: `+${points}`,
        x: rect.left + rect.width / 2,
        y: rect.top
      };
      setFloatingTexts(prev => [...prev, newText]);
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
      }, 1000);

      setTimeout(nextRound, 400);
    } else {
      setCombo(0);
      setTimeout(nextRound, 800);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FFD400]/5 rounded-full blur-[120px]" />
        
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,212,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,212,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button 
          onClick={() => onClose(score)}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
        
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
            className="fixed z-50 text-[#FFD400] font-black text-2xl glow-text-yellow pointer-events-none"
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
              <MousePointerClick size={64} className="text-[#FFD400] mb-8 opacity-50" />
              <h2 className="text-white font-black text-2xl uppercase tracking-widest mb-2">Prepare-se</h2>
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
                  <span className="text-white/40 font-bold text-xs uppercase tracking-widest mb-1">Tempo</span>
                  <div className="flex items-center gap-2">
                    <Timer size={20} className={timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-[#FFD400]"} />
                    <span className={`font-black text-3xl ${timeLeft <= 5 ? "text-red-500" : "text-white"}`}>
                      00:{timeLeft.toString().padStart(2, '0')}
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

              {/* Progress Bar */}
              <div className="px-6 mb-12">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-[#FFD400] glow-yellow'}`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / 30) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </div>

              {/* Target Word */}
              <div className="flex-1 flex items-center justify-center px-6">
                <motion.div 
                  key={currentWord.pt}
                  initial={{ y: 20, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <span className="text-[#FFD400] font-bold text-sm uppercase tracking-widest mb-4 block">Traduza:</span>
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
                    // Show correct answer if user got it wrong
                    btnClass = "bg-[#FFD400]/20 border-[#FFD400] text-[#FFD400]";
                  } else if (selectedOption) {
                    // Dim other options
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
                className="w-24 h-24 bg-[#FFD400] rounded-full flex items-center justify-center mb-8 glow-yellow shadow-[0_0_50px_rgba(255,212,0,0.5)]"
              >
                <Trophy size={48} className="text-[#050505]" />
              </motion.div>
              
              <h2 className="text-white font-black text-4xl uppercase tracking-widest mb-2">Vitória!</h2>
              <p className="text-white/50 font-bold text-sm uppercase tracking-widest mb-12">Sessão Concluída</p>
              
              <div className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-sm mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD400]/10 blur-[50px]" />
                
                <div className="flex flex-col items-center mb-6">
                  <span className="text-[#FFD400] font-bold text-xs uppercase tracking-widest mb-2">Pontuação Final</span>
                  <span className="text-white font-black text-6xl glow-text-yellow">{score}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t border-white/5">
                  <span className="text-white/50 font-bold text-sm">Maior Combo</span>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame size={16} />
                    <span className="font-black text-lg">x{combo}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t border-white/5">
                  <span className="text-white/50 font-bold text-sm">XP Ganho</span>
                  <span className="text-[#FFD400] font-black text-lg">+10 XP</span>
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
                    setTimeLeft(30);
                  }}
                  className="w-full bg-[#FFD400] text-[#050505] font-black text-lg py-5 rounded-2xl uppercase tracking-widest shadow-[0_10px_0_#B39500] flex items-center justify-center gap-2"
                >
                  Jogar Novamente <Zap size={20} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onClose(score)}
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
        .glow-text-orange {
          text-shadow: 0 0 15px rgba(249,115,22,0.6);
        }
      `}</style>
    </div>
  );
};
