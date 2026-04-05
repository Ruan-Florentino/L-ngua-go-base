import React, { useState } from 'react';
import { Mic, Zap, BookOpen, Play, Gift, Target, Check } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

const initialTasks = [
  { id: 1, title: 'Flashcards', desc: 'Revise 20 palavras', icon: BookOpen, xp: 10, progress: 100 },
  { id: 2, title: 'Montagem de Frases', desc: 'Acerte 5 frases seguidas', icon: Zap, xp: 15, progress: 60 },
  { id: 3, title: 'Tap Game', desc: 'Modo velocidade', icon: Target, xp: 10, progress: 0 },
  { id: 4, title: 'Falar', desc: 'Pratique pronúncia', icon: Mic, xp: 20, progress: 0 },
];

const springTransition = { type: "spring", stiffness: 200, damping: 25 };

export const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [justCompleted, setJustCompleted] = useState<number | null>(null);

  const completedCount = tasks.filter(t => t.progress === 100).length;

  const handleTaskClick = (id: number, isCompleted: boolean, e: React.MouseEvent) => {
    if (!isCompleted) {
      setTasks(tasks.map(t => t.id === id ? { ...t, progress: 100 } : t));
      setJustCompleted(id);
      
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x, y },
        colors: ['#FFD400', '#FFFFFF']
      });

      setTimeout(() => setJustCompleted(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6 space-y-8 pb-40">
      <header className="mt-8">
        <h1 className="text-4xl font-black text-[#FFD400] tracking-tight drop-shadow-lg glow-text-yellow uppercase mb-6">
          Missões do Dia
        </h1>
        
        {/* Daily Progress */}
        <div className="bg-[#111] p-6 rounded-[2rem] border border-white/10 shadow-xl card-3d relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FFD400]/10 to-transparent pointer-events-none" />
          
          <div className="flex justify-between items-end mb-4 relative z-10">
            <span className="text-gray-400 font-black uppercase tracking-wider text-sm">Progresso Geral</span>
            <span className="text-[#FFD400] font-black text-2xl drop-shadow-[0_0_10px_rgba(255,212,0,0.5)]">
              {completedCount}/{tasks.length}
            </span>
          </div>
          
          <div className="h-4 bg-[#222] rounded-full overflow-hidden border border-white/5 shadow-inner relative mb-4 z-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
              transition={{ duration: 1, ...springTransition }}
              className="absolute top-0 left-0 h-full bg-[#FFD400] rounded-full glow-yellow"
            />
          </div>
          
          <div className="flex items-center gap-3 text-[#FFD400] text-sm font-bold relative z-10">
            <Gift size={20} className="drop-shadow-[0_0_8px_rgba(255,212,0,0.8)]" />
            <span>Baú desbloqueia ao completar</span>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {tasks.map((task, i) => {
          const isCompleted = task.progress === 100;
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, ...springTransition }}
              whileHover={{ scale: 1.02 }}
              className={`relative p-6 rounded-[2rem] border-2 shadow-2xl card-3d transition-all duration-300 ${
                isCompleted 
                  ? 'bg-[#111] border-[#FFD400] glow-yellow' 
                  : 'bg-[#111] border-white/5 hover:border-white/20'
              }`}
            >
              {isCompleted && <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,212,0,0.15)_0%,transparent_60%)] pointer-events-none" />}
              
              {/* Floating XP Animation */}
              {justCompleted === task.id && (
                <motion.div 
                  initial={{ opacity: 1, y: 0, scale: 0.5 }} 
                  animate={{ opacity: 0, y: -60, scale: 1.5 }} 
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute right-8 top-8 text-[#FFD400] font-black text-3xl drop-shadow-[0_0_15px_rgba(255,212,0,1)] z-50 pointer-events-none"
                >
                  +{task.xp} XP
                </motion.div>
              )}

              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border ${
                    isCompleted ? 'bg-[#FFD400]/20 border-[#FFD400]/50' : 'bg-[#222] border-white/10'
                  }`}>
                    <task.icon size={32} className={`${isCompleted ? 'text-[#FFD400] drop-shadow-[0_0_10px_rgba(255,212,0,0.8)]' : 'text-gray-400'}`} />
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <h3 className={`font-black text-xl uppercase tracking-wider mb-1 ${isCompleted ? 'text-white' : 'text-gray-300'}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">{task.desc}</p>
                  </div>
                </div>
                
                <div className="w-full h-3 bg-[#222] rounded-full overflow-hidden border border-white/5 shadow-inner mt-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full rounded-full ${isCompleted ? 'bg-[#FFD400] glow-yellow' : 'bg-gray-500'}`} 
                  />
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className={`font-black text-2xl ${isCompleted ? 'text-[#FFD400] drop-shadow-[0_0_10px_rgba(255,212,0,0.5)]' : 'text-gray-500'}`}>
                    +{task.xp} XP
                  </span>
                  
                  {isCompleted ? (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={springTransition}
                      className="w-14 h-14 rounded-full bg-[#FFD400] flex items-center justify-center glow-yellow shadow-lg"
                    >
                      <Check size={32} className="text-[#050505]" />
                    </motion.div>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleTaskClick(task.id, isCompleted, e)}
                      className="w-14 h-14 rounded-full bg-[#FFD400] flex items-center justify-center glow-yellow shadow-lg cursor-pointer"
                    >
                      <Play size={28} className="text-[#050505] fill-[#050505] ml-1" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Final Reward Chest */}
      {completedCount === tasks.length && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ...springTransition }}
          className="mt-12 bg-[#111] p-8 rounded-[2.5rem] border-2 border-[#FFD400] glow-yellow-strong flex flex-col items-center text-center relative overflow-hidden card-3d"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,212,0,0.2)_0%,transparent_70%)] pointer-events-none" />
          
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative z-10 mb-6"
          >
            <Gift size={80} className="text-[#FFD400] drop-shadow-[0_0_30px_rgba(255,212,0,1)]" />
          </motion.div>
          
          <h2 className="text-3xl font-black text-white uppercase tracking-wider relative z-10 mb-2">
            Recompensa Diária
          </h2>
          <p className="text-gray-400 font-bold mb-8 relative z-10">Você completou todas as missões!</p>
          
          <div className="flex gap-4 relative z-10 w-full">
            <div className="flex-1 bg-[#050505] border border-[#FFD400]/50 p-4 rounded-2xl flex flex-col items-center glow-yellow shadow-inner">
              <span className="text-[#FFD400] font-black text-3xl mb-1">+40</span>
              <span className="text-gray-400 font-black text-xs uppercase tracking-widest">XP</span>
            </div>
            <div className="flex-1 bg-[#050505] border border-[#FFD400]/50 p-4 rounded-2xl flex flex-col items-center glow-yellow shadow-inner">
              <span className="text-[#FFD400] font-black text-3xl mb-1">+50</span>
              <span className="text-gray-400 font-black text-xs uppercase tracking-widest">Moedas</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
