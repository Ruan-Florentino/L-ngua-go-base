import React, { useState, useEffect } from 'react';
import { Flame, Play, Target, Gift, Trophy, Lock, Check, Zap, ShieldAlert, Clock, Layers, MessageSquare, MousePointerClick, Coins, Star, Calendar, ZapOff, ShoppingBag, Map as MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Mascot } from '../components/Mascot';
import { MissionCenter } from '../components/MissionCenter';
import { playSound } from '../lib/sounds';
import { Rank, GameEvent } from '../types';

const springTransition = { type: "spring", stiffness: 300, damping: 25 };

export const Home = ({ 
  onStartTapGame, 
  onStartRunnerGame,
  onOpenShop,
  totalXP = 2400,
  coins = 150,
  streak = 12,
  rank,
  event
}: { 
  onStartTapGame?: () => void;
  onStartRunnerGame?: () => void;
  onOpenShop?: () => void;
  totalXP?: number;
  coins?: number;
  streak?: number;
  rank: Rank;
  event: GameEvent;
}) => {
  const [animatedXP, setAnimatedXP] = useState(totalXP - 50);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showStreakLoss, setShowStreakLoss] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('Bora treinar?');

  useEffect(() => {
    setAnimatedXP(totalXP - 50);
    const interval = setInterval(() => {
      setAnimatedXP(prev => {
        if (prev < totalXP) return prev + 1;
        clearInterval(interval);
        return totalXP;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [totalXP]);

  useEffect(() => {
    const messages = [
      'Você tá voando! 🚀',
      'Bora bater o recorde?',
      'O ranking tá pegando fogo!',
      'Não para agora!',
      'Já treinou hoje?',
    ];
    const interval = setInterval(() => {
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartJourney = () => {
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
    if (onStartRunnerGame) onStartRunnerGame();
  };

  const getStreakMultiplier = () => {
    if (streak >= 15) return 2.0;
    if (streak >= 7) return 1.5;
    if (streak >= 3) return 1.2;
    return 1.0;
  };

  return (
    <div className="min-h-screen bg-transparent relative pb-48 overflow-x-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFD400] rounded-full glow-yellow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 4,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* TOPO PREMIUM */}
      <div className="relative z-10 pt-10 pb-4 px-6 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 sticky top-0 flex items-center justify-between">
        
        {/* User Level & Mascot */}
        <div className="flex items-center gap-3">
          <Mascot mood="happy" size={40} message={mascotMessage} />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-black text-sm uppercase tracking-wider">{rank.type}</span>
              <span className="text-lg">{rank.badge}</span>
            </div>
            <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">
              XP: <span className="text-[#FFD400]">{animatedXP}</span>
            </div>
          </div>
        </div>

        {/* Streak & Coins */}
        <div className="flex items-center gap-3">
          {/* Shop Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenShop}
            className="flex items-center gap-1.5 bg-[#FFD400]/10 px-3 py-1.5 rounded-xl border border-[#FFD400]/20"
          >
            <ShoppingBag size={16} className="text-[#FFD400]" />
            <span className="text-[#FFD400] font-black text-xs uppercase tracking-widest">Loja</span>
          </motion.button>

          {/* Streak */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStreakModal(true)}
            className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20"
          >
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Flame size={16} className="text-orange-500 fill-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
            </motion.div>
            <span className="text-orange-500 font-black text-sm">{streak}</span>
          </motion.button>

          {/* Coins */}
          <div className="flex items-center gap-1.5 bg-[#FFD400]/10 px-3 py-1.5 rounded-xl border border-[#FFD400]/20">
            <Coins size={16} className="text-[#FFD400] drop-shadow-[0_0_5px_rgba(255,212,0,0.8)]" />
            <span className="text-[#FFD400] font-black text-sm">{coins}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 pt-6 space-y-6">
        
        {/* EVENTO SEMANAL */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-r from-[#FFD400]/20 to-transparent p-4 rounded-2xl border-l-4 border-[#FFD400] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFD400] rounded-full flex items-center justify-center text-[#050505]">
              <Calendar size={20} />
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest">{event.title}</h4>
              <p className="text-[#FFD400] font-bold text-[10px] uppercase tracking-wider">{event.description}</p>
            </div>
          </div>
          <div className="bg-[#FFD400] text-[#050505] px-2 py-1 rounded-lg font-black text-[10px]">
            {event.multiplier}x XP
          </div>
        </motion.div>

        {/* CARD PRINCIPAL: Missão Atual */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#111] p-6 rounded-3xl border border-[#FFD400]/40 shadow-[0_0_25px_rgba(255,212,0,0.2)] card-3d relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD400] blur-[90px] opacity-20 -z-10" />
          
          <h2 className="text-[#FFD400] font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 glow-text-yellow">
            <Target size={14} /> Missão Atual
          </h2>
          
          <h3 className="text-3xl font-black text-white uppercase tracking-wide mb-4 drop-shadow-md">
            LinguaGo Runner
          </h3>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-1.5 bg-[#FFD400]/10 px-3 py-1.5 rounded-xl border border-[#FFD400]/20">
              <Zap size={14} className="text-[#FFD400] fill-[#FFD400]" /> 
              <span className="text-[#FFD400] font-bold text-xs">XP Infinito</span>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20">
              <Flame size={14} className="text-orange-500" /> 
              <span className="text-orange-500 font-bold text-xs">x{getStreakMultiplier()} XP</span>
            </div>
            {event.multiplier > 1 && (
              <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
                <Star size={14} className="text-blue-400 fill-blue-400" /> 
                <span className="text-blue-400 font-bold text-xs">+{event.multiplier}x Evento</span>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartJourney}
            className="w-full bg-[#FFD400] text-[#050505] font-black text-sm py-4 rounded-xl uppercase tracking-widest glow-yellow shadow-[0_6px_0_#B39500] flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Play size={18} className="fill-current" /> Jogar Agora
            </span>
            <motion.div 
              className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]"
            />
          </motion.button>
        </motion.div>

        {/* DESAFIO DIÁRIO */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#111] p-5 rounded-3xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 blur-[40px] opacity-20" />
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-purple-500 fill-purple-500" />
              <h3 className="text-white font-black text-sm uppercase tracking-widest">Desafio Diário</h3>
            </div>
            <div className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg font-black text-[10px]">
              DIFÍCIL
            </div>
          </div>
          <p className="text-gray-400 text-xs mb-4">Acerte 50 palavras no Tap Game sem errar nenhuma!</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
                <Star size={12} className="text-purple-500 fill-purple-500" />
                <span className="text-purple-500 font-black text-[10px]">+40 XP</span>
              </div>
              <div className="flex items-center gap-1 bg-[#FFD400]/10 px-2 py-1 rounded-lg border border-[#FFD400]/20">
                <Coins size={12} className="text-[#FFD400]" />
                <span className="text-[#FFD400] font-black text-[10px]">+25</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartTapGame}
              className="bg-purple-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-[0_4px_0_#7E22CE]"
            >
              Aceitar
            </motion.button>
          </div>
        </motion.div>

        {/* Journey Map */}
        <div className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white font-black text-xl uppercase tracking-widest">Sua Jornada</h2>
            <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
              <Layers size={14} /> Mapa do Mundo
            </div>
          </div>
          
          <MissionCenter 
            onStartRunner={onStartRunnerGame} 
            onStartTap={onStartTapGame} 
          />
        </div>

        {/* MISSÕES RÁPIDAS */}
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-6 px-6">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0 bg-[#111] border border-white/5 rounded-2xl p-3 flex items-center gap-3 min-w-[140px] card-3d">
            <div className="w-10 h-10 bg-[#FFD400]/10 rounded-xl flex items-center justify-center text-[#FFD400] border border-[#FFD400]/20">
              <Layers size={20} />
            </div>
            <span className="text-white font-bold text-sm uppercase tracking-wider">Flashcards</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={onStartTapGame}
            className="flex-shrink-0 bg-[#111] border border-white/5 rounded-2xl p-3 flex items-center gap-3 min-w-[140px] card-3d"
          >
            <div className="w-10 h-10 bg-[#FFD400]/10 rounded-xl flex items-center justify-center text-[#FFD400] border border-[#FFD400]/20">
              <MousePointerClick size={20} />
            </div>
            <span className="text-white font-bold text-sm uppercase tracking-wider">Tap Game</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0 bg-[#111] border border-white/5 rounded-2xl p-3 flex items-center gap-3 min-w-[140px] card-3d">
            <div className="w-10 h-10 bg-[#FFD400]/10 rounded-xl flex items-center justify-center text-[#FFD400] border border-[#FFD400]/20">
              <MessageSquare size={20} />
            </div>
            <span className="text-white font-bold text-sm uppercase tracking-wider">Frases</span>
          </motion.button>
        </div>

        {/* RECOMPENSA & RANKING MINI */}
        <div className="grid grid-cols-2 gap-4">
          {/* Recompensa do Dia */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#111] p-5 rounded-3xl border border-[#FFD400]/20 shadow-[0_0_15px_rgba(255,212,0,0.1)] card-3d flex flex-col items-center text-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFD400]/5 to-transparent pointer-events-none" />
            <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Gift size={36} className="text-[#FFD400] drop-shadow-[0_0_10px_rgba(255,212,0,0.5)] mb-3" />
            </motion.div>
            <h4 className="text-gray-300 font-bold text-[10px] uppercase tracking-widest mb-1">Complete tudo</h4>
            <span className="text-[#FFD400] font-black text-lg glow-text-yellow">Baú Épico</span>
          </motion.div>

          {/* Ranking Mini */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#111] p-5 rounded-3xl border border-white/5 shadow-lg card-3d flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col">
                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Liga Ouro</span>
                <Trophy size={20} className="text-[#FFD400]" />
              </div>
              <span className="text-white font-black text-2xl">#2</span>
            </div>
            
            <div className="mt-2">
              <div className="text-[#FFD400] text-[10px] font-bold mb-1.5 uppercase tracking-wider">120 XP para subir</div>
              <div className="h-1.5 bg-[#222] rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-[#FFD400] glow-yellow"
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* BOTÃO FLUTUANTE */}
      <div className="fixed bottom-24 left-0 right-0 px-6 z-40 flex justify-center pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,212,0,0.8)" }}
          whileTap={{ scale: 0.95, y: 5 }}
          onClick={handleStartJourney}
          animate={{ boxShadow: ["0 0 15px rgba(255,212,0,0.4)", "0 0 25px rgba(255,212,0,0.8)", "0 0 15px rgba(255,212,0,0.4)"] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="pointer-events-auto w-full max-w-sm bg-[#FFD400] text-[#050505] font-black text-lg py-4 rounded-2xl uppercase tracking-widest shadow-[0_10px_0_#B39500] flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Play size={20} className="fill-current" /> Continuar Jornada
          </span>
          {/* Horizontal Shine Effect */}
          <motion.div 
            className="absolute top-0 left-0 w-1/2 h-full bg-white/40 skew-x-12 -translate-x-[150%]"
            animate={{ translateX: ['-150%', '250%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
          />
        </motion.button>
      </div>

      {/* STREAK MODAL */}
      <AnimatePresence>
        {showStreakModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-orange-500/30 rounded-3xl p-8 w-full max-w-sm relative overflow-hidden flex flex-col items-center"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/20 blur-[80px] -z-10" />
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mb-6"
              >
                <Flame size={80} className="text-orange-500 fill-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]" />
              </motion.div>

              <h2 className="text-white font-black text-4xl uppercase tracking-widest mb-2 text-center">
                {streak} Dias
              </h2>
              <p className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-8 text-center">
                Sequência Incrível! 🔥
              </p>

              <div className="w-full space-y-4 mb-8">
                <div className={`flex justify-between items-center p-4 rounded-xl border ${streak >= 3 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[#222] border-white/5'}`}>
                  <span className="text-white font-bold">3 Dias</span>
                  <span className={streak >= 3 ? 'text-orange-500 font-black' : 'text-gray-500 font-bold'}>+10% XP</span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-xl border ${streak >= 7 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[#222] border-white/5'}`}>
                  <span className="text-white font-bold">7 Dias</span>
                  <span className={streak >= 7 ? 'text-orange-500 font-black' : 'text-gray-500 font-bold'}>+20% XP</span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-xl border ${streak >= 15 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[#222] border-white/5'}`}>
                  <span className="text-white font-bold">15 Dias</span>
                  <span className={streak >= 15 ? 'text-orange-500 font-black' : 'text-gray-500 font-bold'}>+50% XP</span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-xl border ${streak >= 30 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[#222] border-white/5'}`}>
                  <span className="text-white font-bold">30 Dias</span>
                  <span className={streak >= 30 ? 'text-[#FFD400] font-black' : 'text-gray-500 font-bold'}>Avatar Raro</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStreakModal(false)}
                className="w-full bg-orange-500 text-white font-black text-lg py-4 rounded-2xl uppercase tracking-widest shadow-[0_8px_0_#C2410C]"
              >
                Continuar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streak Loss Modal */}
      <AnimatePresence>
        {showStreakLoss && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050505]/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-[#111] border-2 border-red-500/30 rounded-[40px] p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Flame size={48} className="text-red-500 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-16 h-16 border-2 border-red-500 rounded-full"
                  />
                </div>
              </motion.div>

              <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-4">Streak Perdida! 💔</h2>
              <p className="text-white/60 font-medium mb-8 leading-relaxed">
                Você ficou um dia sem praticar e sua sequência de <span className="text-red-500 font-bold">{streak} dias</span> quebrou.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStreakLoss(false)}
                className="w-full bg-red-500 text-white font-black text-lg py-5 rounded-2xl uppercase tracking-widest shadow-[0_10px_0_#991B1B]"
              >
                Vou recomeçar! 🔥
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
