import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Clock, ArrowUp, ArrowDown, ShieldAlert, Zap, Star, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const springTransition = { type: "spring", stiffness: 300, damping: 25 };

const initialUsers = [
  { id: 1, name: 'Maria', xp: 3450, avatar: 'M', seed: 'Maria', rank: 1, trend: 'up' },
  { id: 2, name: 'João', xp: 3120, avatar: 'J', seed: 'Joao', rank: 2, trend: 'up' },
  { id: 3, name: 'Ana', xp: 2980, avatar: 'A', seed: 'Ana', rank: 3, trend: 'down' },
  { id: 4, name: 'Você', xp: 2860, avatar: 'V', seed: 'LinguaGo', rank: 4, isMe: true, trend: 'up' },
  { id: 5, name: 'Pedro', xp: 2700, avatar: 'P', seed: 'Pedro', rank: 5, trend: 'down' },
  { id: 6, name: 'Lucas', xp: 2500, avatar: 'L', seed: 'Lucas', rank: 6, trend: 'down' },
];

const LEAGUES = [
  { id: 'bronze', name: 'Bronze', color: '#CD7F32', icon: '🥉' },
  { id: 'silver', name: 'Prata', color: '#C0C0C0', icon: '🥈' },
  { id: 'gold', name: 'Ouro', color: '#FFD400', icon: '🥇' },
  { id: 'diamond', name: 'Diamante', color: '#B9F2FF', icon: '💎' },
  { id: 'master', name: 'Mestre', color: '#F59E0B', icon: '👑' },
];

export const Ranking = ({ bestScore = 0 }: { bestScore?: number }) => {
  const [activeLeague, setActiveLeague] = useState('gold');
  const [users, setUsers] = useState(initialUsers);
  const [showPromotion, setShowPromotion] = useState(false);
  const [animatedXP, setAnimatedXP] = useState(initialUsers[0].xp);

  const currentLeague = LEAGUES.find(l => l.id === activeLeague) || LEAGUES[2];

  // Update user's score based on bestScore
  useEffect(() => {
    setUsers(prev => {
      const newUsers = [...prev];
      const meIndex = newUsers.findIndex(u => u.isMe);
      if (meIndex !== -1) {
        // Base XP + Runner Best Score
        newUsers[meIndex].xp = 2860 + bestScore;
      }
      // Re-sort and re-rank
      newUsers.sort((a, b) => b.xp - a.xp);
      newUsers.forEach((u, i) => u.rank = i + 1);
      return newUsers;
    });
  }, [bestScore]);

  const meIndex = users.findIndex(u => u.isMe);
  const me = users[meIndex];
  const firstPlace = users[0];
  const rival = users[meIndex - 1]; // The person right above me
  const xpToFirst = firstPlace.xp - me.xp;
  const xpToRival = rival ? rival.xp - me.xp : 0;

  // Animate 1st place XP counting up
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedXP(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulatePromotion = () => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setShowPromotion(true);
    setTimeout(() => setShowPromotion(false), 4000);
  };

  return (
    <div className="min-h-screen bg-transparent relative pb-40 overflow-x-hidden">
      
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
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 3,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* League Selector */}
      <div className="relative z-10 px-6 pt-12 flex justify-between items-center overflow-x-auto hide-scrollbar gap-4 mb-8">
        {LEAGUES.map((league) => (
          <motion.button
            key={league.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveLeague(league.id)}
            className={`flex flex-col items-center gap-2 min-w-[70px] transition-all duration-300 ${
              activeLeague === league.id ? 'opacity-100' : 'opacity-30 grayscale'
            }`}
          >
            <div 
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-300 ${
                activeLeague === league.id ? 'bg-white/10 border-white/20 shadow-lg' : 'bg-transparent border-white/5'
              }`}
              style={{ borderColor: activeLeague === league.id ? league.color : 'transparent' }}
            >
              {league.icon}
            </div>
            <span className="text-white font-black text-[10px] uppercase tracking-widest">{league.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Topo: Liga Ativa */}
      <div className="relative z-10 pb-6 px-6 flex flex-col items-center text-center">
        <motion.div 
          key={activeLeague}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-4 cursor-pointer"
          onClick={handleSimulatePromotion}
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 blur-[40px] rounded-full" 
            style={{ backgroundColor: currentLeague.color }}
          />
          <Trophy size={80} className="drop-shadow-[0_0_25px_rgba(255,212,0,0.8)] relative z-10" style={{ color: currentLeague.color }} />
        </motion.div>
        
        <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-2 drop-shadow-lg">
          Liga <span className="glow-text-yellow" style={{ color: currentLeague.color }}>{currentLeague.name}</span>
        </h1>
        
        <div 
          className="bg-[#111]/80 backdrop-blur-md border px-6 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(255,212,0,0.15)] mb-4"
          style={{ borderColor: `${currentLeague.color}40` }}
        >
          <ArrowUp size={18} style={{ color: currentLeague.color }} />
          <span className="font-bold text-sm uppercase tracking-wider" style={{ color: currentLeague.color }}>Top 3 sobem de liga</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 font-black text-xs uppercase tracking-widest bg-[#050505] px-3 py-1.5 rounded-xl border border-white/5">
            <Clock size={14} className="text-[#FFD400]" />
            <span className="text-white">12h 24m</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-black text-xs uppercase tracking-widest bg-[#050505] px-3 py-1.5 rounded-xl border border-white/5">
            <Gift size={14} className="text-[#FFD400]" />
            <span className="text-white">Baú Épico</span>
          </div>
        </div>
      </div>

      {/* Barra Competitiva (Trilha) */}
      <div className="relative z-10 px-6 mb-16 mt-4">
        <div className="bg-[#111] p-5 rounded-3xl border border-white/10 shadow-xl card-3d relative">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">
            <span className="flex items-center gap-1"><ShieldAlert size={12}/> Rebaixamento</span>
            <span className="flex items-center gap-1 text-[#FFD400]">Promoção <Trophy size={12}/></span>
          </div>
          
          <div className="relative h-3 bg-[#222] rounded-full border border-white/5 shadow-inner">
            {/* Gradient Track */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-800 via-[#FFD400]/20 to-[#FFD400]/60" 
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* User Avatar on Track */}
            <motion.div 
              initial={{ left: 0 }}
              animate={{ left: '75%' }}
              transition={{ duration: 1.5, ...springTransition, delay: 0.5 }}
              className="absolute top-1/2 -translate-y-1/2 -ml-4 flex flex-col items-center"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 rounded-full border-2 border-[#FFD400] bg-[#050505] p-0.5 glow-yellow shadow-lg z-10"
              >
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${me.seed}&backgroundColor=050505`} alt="Você" className="w-full h-full rounded-full" />
              </motion.div>
              <div className="w-1 h-4 bg-[#FFD400] mt-1 rounded-full glow-yellow" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Pódio 3D */}
      <div className="relative z-10 px-6 mb-12 h-64 flex items-end justify-center gap-2 sm:gap-4">
        
        {/* 2nd Place */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center relative w-1/3 max-w-[100px]"
        >
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full border-4 border-gray-400 bg-[#111] p-1 shadow-[0_0_15px_rgba(156,163,175,0.4)] z-10 relative">
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${users[1].seed}&backgroundColor=111`} alt="2nd" className="w-full h-full rounded-full" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gray-400 text-[#050505] text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#050505] z-20">
              2
            </div>
          </div>
          <div className="w-full h-24 bg-gradient-to-t from-gray-400/5 to-gray-400/20 border-t-2 border-gray-400 rounded-t-xl flex flex-col items-center justify-start pt-3 backdrop-blur-sm">
            <span className="text-gray-300 font-bold text-sm">{users[1].name}</span>
            <span className="text-gray-400 font-black text-xs">{users[1].xp} XP</span>
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center relative w-1/3 max-w-[120px] z-20"
        >
          {/* Animated Rising XP */}
          <motion.div 
            animate={{ y: [0, -30], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            className="absolute -top-8 text-[#FFD400] font-black text-sm glow-text-yellow"
          >
            +15 XP
          </motion.div>

          <motion.div 
            animate={{ rotate: [-5, 5, -5], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -top-10 z-30"
          >
            <Crown size={40} className="text-[#FFD400] fill-[#FFD400] drop-shadow-[0_0_20px_rgba(255,212,0,1)]" />
          </motion.div>
          
          <div className="relative mb-3">
            <motion.div 
              animate={{ boxShadow: ["0 0 15px rgba(255,212,0,0.5)", "0 0 30px rgba(255,212,0,1)", "0 0 15px rgba(255,212,0,0.5)"] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 rounded-full border-4 border-[#FFD400] bg-[#111] p-1 z-10 relative"
            >
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${users[0].seed}&backgroundColor=111`} alt="1st" className="w-full h-full rounded-full" />
            </motion.div>
            <div className="absolute -bottom-2 -right-2 bg-[#FFD400] text-[#050505] text-sm font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#050505] z-20 shadow-[0_0_10px_rgba(255,212,0,0.8)]">
              1
            </div>
          </div>
          <div className="w-full h-32 bg-gradient-to-t from-[#FFD400]/10 to-[#FFD400]/30 border-t-4 border-[#FFD400] rounded-t-xl flex flex-col items-center justify-start pt-3 backdrop-blur-sm shadow-[0_-10px_30px_rgba(255,212,0,0.15)]">
            <span className="text-white font-black text-base drop-shadow-md">{users[0].name}</span>
            <motion.span 
              key={animatedXP}
              initial={{ scale: 1.2, color: '#FFF' }}
              animate={{ scale: 1, color: '#FFD400' }}
              className="text-[#FFD400] font-black text-sm drop-shadow-[0_0_5px_rgba(255,212,0,0.8)]"
            >
              {animatedXP} XP
            </motion.span>
          </div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center relative w-1/3 max-w-[100px]"
        >
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full border-4 border-amber-700 bg-[#111] p-1 shadow-[0_0_15px_rgba(180,83,9,0.4)] z-10 relative">
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${users[2].seed}&backgroundColor=111`} alt="3rd" className="w-full h-full rounded-full" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-700 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#050505] z-20">
              3
            </div>
          </div>
          <div className="w-full h-20 bg-gradient-to-t from-amber-700/5 to-amber-700/20 border-t-2 border-amber-700 rounded-t-xl flex flex-col items-center justify-start pt-3 backdrop-blur-sm">
            <span className="text-gray-300 font-bold text-sm">{users[2].name}</span>
            <span className="text-amber-600 font-black text-xs">{users[2].xp} XP</span>
          </div>
        </motion.div>

      </div>

      {/* Lista de Ranking */}
      <div className="relative z-10 px-6 space-y-4">
        {users.slice(3).map((user, index) => {
          const isDirectRival = user.id === rival?.id;
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center p-4 rounded-2xl card-3d transition-all duration-300 ${
                user.isMe 
                  ? 'bg-[#111] border-2 border-[#FFD400] shadow-[0_0_20px_rgba(255,212,0,0.2)]' 
                  : isDirectRival
                    ? 'bg-[#111] border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'bg-[#111] border border-white/5'
              }`}
            >
              <div className="w-8 text-center font-black text-xl text-gray-500 mr-4">
                #{user.rank}
              </div>
              
              <div className={`relative w-12 h-12 rounded-full p-0.5 mr-4 ${user.isMe ? 'border-2 border-[#FFD400]' : isDirectRival ? 'border border-red-500/50' : 'border border-gray-600'}`}>
                <motion.div
                  animate={user.isMe ? { boxShadow: ["0 0 5px rgba(255,212,0,0.5)", "0 0 15px rgba(255,212,0,0.8)", "0 0 5px rgba(255,212,0,0.5)"] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-full h-full rounded-full overflow-hidden"
                >
                  <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.seed}&backgroundColor=050505`} alt={user.name} className="w-full h-full" />
                </motion.div>
                {user.isMe && (
                  <div className="absolute -bottom-1 -right-1 bg-[#FFD400] text-[#050505] text-[10px] font-black px-1.5 py-0.5 rounded-md border border-[#050505]">
                    LVL 5
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-black text-lg ${user.isMe ? 'text-white' : isDirectRival ? 'text-red-400' : 'text-gray-300'}`}>
                    {user.isMe ? 'VOCÊ' : user.name}
                  </h3>
                  {user.isMe && (
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-2 h-2 rounded-full bg-[#FFD400] glow-yellow"
                    />
                  )}
                  {isDirectRival && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                      RIVAL
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className={`font-bold text-sm ${user.isMe ? 'text-[#FFD400]' : 'text-gray-500'}`}>
                    {user.xp} XP
                  </p>
                  {isDirectRival && (
                    <span className="text-[10px] font-bold text-gray-500">
                      (+{xpToRival} XP)
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                {user.trend === 'up' ? (
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <ArrowUp size={20} className="text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                  </motion.div>
                ) : (
                  <motion.div animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <ArrowDown size={20} className="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Efeito Competição */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 bg-[#FFD400]/10 border border-[#FFD400]/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(255,212,0,0.1)]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFD400]/20 flex items-center justify-center">
              <Zap size={20} className="text-[#FFD400] fill-[#FFD400]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Falta pouco para o topo!</p>
              <p className="text-[#FFD400] font-black text-xs uppercase tracking-wider">+{xpToFirst} XP atrás do 1º</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#FFD400] text-[#050505] font-black text-xs px-4 py-2 rounded-xl uppercase tracking-wider glow-yellow shadow-lg transition-transform relative overflow-hidden group"
          >
            <span className="relative z-10">Praticar</span>
            <motion.div 
              className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]"
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Animação de Subir de Liga */}
      <AnimatePresence>
        {showPromotion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
          >
            {/* Golden Particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#FFD400] rounded-full"
                initial={{ 
                  x: 0, y: 0, opacity: 1, scale: 0 
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * window.innerWidth,
                  y: (Math.random() - 0.5) * window.innerHeight,
                  opacity: 0,
                  scale: Math.random() * 2 + 1
                }}
                transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
              />
            ))}

            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative flex flex-col items-center"
            >
              {/* Expanding Light */}
              <motion.div 
                animate={{ scale: [0, 2, 3], opacity: [1, 0.8, 0] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 bg-[#FFD400] blur-[100px] rounded-full -z-10"
              />
              
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <Trophy size={140} className="text-[#FFD400] drop-shadow-[0_0_40px_rgba(255,212,0,1)] mb-8" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-5xl font-black text-white uppercase tracking-widest mb-4 text-center drop-shadow-2xl"
              >
                <span className="text-[#FFD400] glow-text-yellow">Promovido!</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-300 font-bold text-lg text-center"
              >
                Bem-vindo à Liga Diamante
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
