import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Star, Gift, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChestRevealProps {
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
  coins: number;
  onComplete: () => void;
}

export const ChestReveal: React.FC<ChestRevealProps> = ({ rarity, xp, coins, onComplete }) => {
  const [step, setStep] = useState<'closed' | 'opening' | 'opened'>('closed');

  const rarityColors = {
    common: '#A0AEC0', // Gray
    rare: '#3B82F6',   // Blue
    epic: '#A855F7',   // Purple
    legendary: '#FFD400' // Gold
  };

  const color = rarityColors[rarity];

  useEffect(() => {
    if (step === 'opening') {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50, 100, 200]);
      
      confetti({
        particleCount: rarity === 'legendary' ? 150 : 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: [color, '#FFFFFF', '#FFD400']
      });

      const timer = setTimeout(() => {
        setStep('opened');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, rarity, color]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-sm">
        
        {/* Background Glow */}
        <motion.div 
          animate={step === 'opened' ? { scale: [1, 2, 1.5], opacity: [0.5, 1, 0.8] } : { scale: 1, opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 rounded-full blur-[100px] -z-10"
          style={{ backgroundColor: color }}
        />

        {/* Chest */}
        <AnimatePresence mode="wait">
          {step === 'closed' && (
            <motion.div
              key="closed"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 1.2, opacity: 0, filter: 'brightness(2)' }}
              onClick={() => setStep('opening')}
              className="cursor-pointer relative"
            >
              <motion.div 
                animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Gift size={160} style={{ color }} className="drop-shadow-[0_0_30px_currentColor]" />
              </motion.div>
              <p className="text-white/50 font-bold text-sm uppercase tracking-widest text-center mt-8 animate-pulse">
                Toque para abrir
              </p>
            </motion.div>
          )}

          {step === 'opened' && (
            <motion.div
              key="opened"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center w-full"
            >
              <Sparkles size={64} style={{ color }} className="mb-6 animate-spin-slow drop-shadow-[0_0_20px_currentColor]" />
              
              <h2 className="text-white font-black text-4xl uppercase tracking-widest mb-2 text-center drop-shadow-lg" style={{ color }}>
                Baú {rarity}
              </h2>
              <p className="text-white/50 font-bold text-sm uppercase tracking-widest mb-12">Recompensas</p>

              <div className="flex gap-4 w-full mb-12">
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex-1 bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#FFD400]/5" />
                  <Star size={32} className="text-[#FFD400] mb-3 drop-shadow-[0_0_10px_rgba(255,212,0,0.8)]" />
                  <span className="text-white font-black text-3xl">+{xp}</span>
                  <span className="text-[#FFD400] font-bold text-xs uppercase tracking-widest">XP</span>
                </motion.div>

                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="flex-1 bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-orange-500/5" />
                  <Coins size={32} className="text-orange-500 mb-3 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                  <span className="text-white font-black text-3xl">+{coins}</span>
                  <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">Moedas</span>
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="w-full bg-[#FFD400] text-[#050505] font-black text-lg py-5 rounded-2xl uppercase tracking-widest shadow-[0_10px_0_#B39500] flex items-center justify-center gap-2"
              >
                Coletar
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};
