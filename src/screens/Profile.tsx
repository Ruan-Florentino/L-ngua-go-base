import React, { useState } from 'react';
import { Settings, Award, Zap, Globe, Share2, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

const springTransition = { type: "spring", stiffness: 200, damping: 25 };

export const Profile = () => {
  const [avatarClicks, setAvatarClicks] = useState(0);

  const handleShare = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { x, y },
      colors: ['#FFD400', '#FFFFFF', '#FFA500']
    });
  };

  const handleAvatarClick = () => {
    setAvatarClicks(prev => prev + 1);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: 0.5, y: 0.3 },
      colors: ['#FFD400']
    });
  };

  return (
    <div className="min-h-screen bg-transparent p-6 space-y-8 pb-32">
      <header className="flex justify-between items-center mt-8">
        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
          Seu <span className="text-[#FFD400] glow-text-yellow">Perfil</span>
        </h1>
        <button className="p-3 bg-[#111]/80 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-[#222] transition-colors shadow-lg">
          <Settings size={24} className="text-gray-400" />
        </button>
      </header>

      <div className="relative pt-12">
        {/* Profile Card */}
        <div className="relative bg-[#111]/80 backdrop-blur-md rounded-[3rem] border border-white/10 p-6 pt-16 flex flex-col items-center text-center shadow-2xl card-3d">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FFD400]/10 to-transparent rounded-t-[3rem] pointer-events-none" />
          
          {/* Avatar */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <motion.div 
              className="relative cursor-pointer"
              whileTap={{ scale: 0.9, rotate: 5 }}
              onClick={handleAvatarClick}
              key={avatarClicks}
              animate={avatarClicks > 0 ? { 
                y: [0, -10, 0], 
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.4 }
              } : {}}
            >
              <motion.div 
                animate={{ boxShadow: ["0 0 10px rgba(255,212,0,0.4)", "0 0 25px rgba(255,212,0,0.8)", "0 0 10px rgba(255,212,0,0.4)"] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-32 h-32 rounded-full border-4 border-[#FFD400] bg-[#050505] p-1 overflow-hidden shadow-2xl relative z-10"
              >
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Você" alt="Avatar" className="w-full h-full object-cover" />
              </motion.div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#050505] text-[#FFD400] text-sm font-black px-4 py-1 rounded-full border border-[#FFD400] shadow-lg whitespace-nowrap glow-yellow z-20">
                NÍVEL 5
              </div>
            </motion.div>
          </div>

          <div className="mt-4">
            <h2 className="text-3xl font-black text-white tracking-tight">Alexandre</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield size={16} className="text-[#FFD400]" />
              <p className="text-[#FFD400] font-bold text-sm uppercase tracking-wider">Membro Elite</p>
            </div>
          </div>
          
          {/* XP Bar */}
          <div className="w-full mt-8 space-y-2">
            <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-wider">
              <span>Progresso</span>
              <span className="text-[#FFD400]">2450 / 3000 XP</span>
            </div>
            <div className="h-4 bg-[#222] rounded-full overflow-hidden border border-white/5 shadow-inner relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '81%' }}
                transition={{ duration: 1.5, ease: "easeOut", ...springTransition }}
                className="absolute top-0 left-0 h-full bg-[#FFD400] rounded-full glow-yellow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springTransition} className="bg-[#111]/80 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 flex flex-col items-center text-center gap-3 shadow-xl card-3d">
          <div className="p-3 bg-[#FFD400]/10 rounded-2xl border border-[#FFD400]/20">
            <Globe className="text-[#FFD400] drop-shadow-[0_0_8px_rgba(255,212,0,0.5)]" size={32} />
          </div>
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-black text-white block"
            >
              3
            </motion.span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Idiomas</span>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springTransition} className="bg-[#111]/80 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 flex flex-col items-center text-center gap-3 shadow-xl card-3d">
          <div className="p-3 bg-[#FFD400]/10 rounded-2xl border border-[#FFD400]/20">
            <Award className="text-[#FFD400] drop-shadow-[0_0_8px_rgba(255,212,0,0.5)]" size={32} />
          </div>
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-black text-white block"
            >
              14
            </motion.span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conquistas</span>
          </div>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-[#111]/80 backdrop-blur-md rounded-[2rem] border border-white/10 p-6 shadow-xl card-3d">
        <h3 className="text-xl font-black text-white mb-6 tracking-tight">Estatísticas de Batalha</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-[#FFD400]" />
              <span className="text-gray-400 font-bold">Total de XP</span>
            </div>
            <span className="font-black text-xl text-white">2.450</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[#FFD400]" />
              <span className="text-gray-400 font-bold">Dias Ativos</span>
            </div>
            <span className="font-black text-xl text-white">42</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-[#FFD400]" />
              <span className="text-gray-400 font-bold">Palavras</span>
            </div>
            <span className="font-black text-xl text-white">840</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleShare}
        className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3 rounded-2xl font-black tracking-wide"
      >
        <Share2 size={24} />
        COMPARTILHAR PERFIL
      </button>
    </div>
  );
};
