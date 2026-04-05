import React, { useState, useEffect } from 'react';
import { Star, Check, Lock, Play, Zap, Flame, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const springTransition = { type: "spring", stiffness: 300, damping: 25 };

const initialNodes = [
  { id: 1, status: 'completed', type: 'lesson', title: 'Básico 1', xp: 10 },
  { id: 2, status: 'completed', type: 'practice', title: 'Prática', xp: 10 },
  { id: 3, status: 'current', type: 'lesson', title: 'Saudações', xp: 15 },
  { id: 4, status: 'locked', type: 'story', title: 'História', xp: 20 },
  { id: 5, status: 'locked', type: 'lesson', title: 'Comida', xp: 15 },
  { id: 6, status: 'locked', type: 'boss', title: 'Boss Final', xp: 50 },
];

export const Journey = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [animatingNodeId, setAnimatingNodeId] = useState<number | null>(null);
  const [floatingXP, setFloatingXP] = useState<{id: number, x: number, y: number, amount: number} | null>(null);
  const [particles, setParticles] = useState<any[]>([]);

  const triggerConfetti = (x: number, y: number) => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      x, y,
      angle: (Math.random() * Math.PI) + Math.PI, // Upwards
      velocity: 50 + Math.random() * 80,
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 360
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1500);
  };

  const handleNodeClick = (node: any, index: number, event: React.MouseEvent) => {
    if (node.status === 'current' && !animatingNodeId) {
      if (navigator.vibrate) navigator.vibrate(50); // Light vibration
      
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setAnimatingNodeId(node.id);
      
      setTimeout(() => {
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]); // Reward vibration
        setFloatingXP({ id: node.id, x: centerX, y: centerY - 40, amount: node.xp });
        triggerConfetti(centerX, centerY);

        setTimeout(() => {
          setNodes(prev => {
            const newNodes = [...prev];
            newNodes[index].status = 'completed';
            if (newNodes[index + 1]) {
              newNodes[index + 1].status = 'current';
            }
            return newNodes;
          });
          setAnimatingNodeId(null);
          setFloatingXP(null);
        }, 1200);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative pb-32 overflow-x-hidden">
      
      {/* Background Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFD400] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px rgba(255,212,0,0.5)'
            }}
            animate={{
              y: [0, -50],
              opacity: [0, 0.6, 0],
              scale: [0, 1.2, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 4,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 rounded-full border-2 border-[#FFD400] p-0.5 glow-yellow relative"
          >
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=LinguaGo&backgroundColor=050505" alt="Avatar" className="w-full h-full rounded-full" />
            <div className="absolute -bottom-1 -right-1 bg-[#FFD400] text-[#050505] text-[9px] font-black px-1.5 py-0.5 rounded-sm border border-[#050505]">
              LVL 5
            </div>
          </motion.div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-white font-black text-sm">Progresso</span>
              <span className="text-[#FFD400] text-xs font-bold">x1.5</span>
            </div>
            <div className="w-24 h-2 bg-[#222] rounded-full overflow-hidden relative border border-white/5 shadow-inner">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#FFD400] glow-yellow" 
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              {/* Shimmer effect on XP bar */}
              <motion.div 
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#111] px-2 py-1 rounded-lg border border-white/5">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Flame size={18} className="text-[#FFD400] fill-[#FFD400] drop-shadow-[0_0_8px_rgba(255,212,0,0.8)]" />
            </motion.div>
            <span className="text-[#FFD400] font-black">12</span>
          </div>
          <div className="flex items-center gap-1 bg-[#111] px-2 py-1 rounded-lg border border-white/5">
            <Star size={16} className="text-[#FFD400] fill-[#FFD400]" />
            <span className="text-[#FFD400] font-black">450</span>
          </div>
        </div>
      </div>

      {/* Path */}
      <div className="relative z-10 py-12 flex flex-col items-center">
        {nodes.map((node, index) => {
          const isLeft = index % 2 === 0;
          const isCurrent = node.status === 'current';
          const isCompleted = node.status === 'completed';
          const isLocked = node.status === 'locked';
          const isAnimating = animatingNodeId === node.id;
          const isNext = isLocked && nodes[index - 1]?.status === 'completed';
          const isBoss = node.type === 'boss';

          return (
            <div key={node.id} className="relative w-full flex justify-center my-8">
              
              {/* Connecting Line */}
              {index < nodes.length - 1 && (
                <svg className="absolute top-1/2 left-0 w-full h-32 pointer-events-none -z-10" style={{ transform: 'translateY(10px)' }}>
                  <motion.path
                    d={isLeft 
                      ? "M 50% 0 C 70% 40, 70% 80, 50% 120" 
                      : "M 50% 0 C 30% 40, 30% 80, 50% 120"}
                    fill="none"
                    stroke={isCompleted || isCurrent ? "#FFD400" : "#222"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className={isCompleted || isCurrent ? "drop-shadow-[0_0_8px_rgba(255,212,0,0.4)]" : ""}
                  />
                  {/* Running Glow on Line */}
                  {(isCompleted || isCurrent) && (
                    <motion.path
                      d={isLeft 
                        ? "M 50% 0 C 70% 40, 70% 80, 50% 120" 
                        : "M 50% 0 C 30% 40, 30% 80, 50% 120"}
                      fill="none"
                      stroke="#FFF"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                      animate={{ pathLength: 0.2, pathOffset: 1, opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    />
                  )}
                </svg>
              )}

              {/* Node Container */}
              <div className={`relative flex flex-col items-center ${isLeft ? 'mr-24' : 'ml-24'}`}>
                
                {/* Current Node Pulsing Ring */}
                {isCurrent && !isAnimating && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-[#FFD400]"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                )}

                {/* The Node */}
                <motion.button
                  onClick={(e) => handleNodeClick(node, index, e)}
                  whileHover={isCurrent ? { scale: 1.05 } : {}}
                  whileTap={isCurrent ? { scale: 0.95 } : {}}
                  animate={
                    isAnimating 
                      ? { scale: [1, 1.2, 1], boxShadow: ["0 0 0px rgba(255,212,0,0)", "0 0 50px rgba(255,212,0,1)", "0 0 20px rgba(255,212,0,0.8)"] }
                      : isCurrent 
                        ? { y: [0, -6, 0] } 
                        : isNext
                          ? { x: [-1, 1, -1], y: [-1, 1, -1] } // Trembling next node
                          : {}
                  }
                  transition={
                    isAnimating 
                      ? { duration: 0.6, ease: "easeOut" }
                      : isCurrent 
                        ? { repeat: Infinity, duration: 2, ease: "easeInOut" } 
                        : isNext
                          ? { repeat: Infinity, duration: 0.5, ease: "linear" }
                          : {}
                  }
                  className={`
                    relative flex items-center justify-center rounded-2xl rotate-45
                    ${isBoss ? 'w-24 h-24' : 'w-20 h-20'}
                    ${isCompleted ? 'bg-[#FFD400] text-[#050505] shadow-[0_0_20px_rgba(255,212,0,0.4)]' : ''}
                    ${isCurrent ? 'bg-[#FFD400] text-[#050505] shadow-[0_0_30px_rgba(255,212,0,0.6)] border-2 border-white' : ''}
                    ${isLocked ? 'bg-[#111] text-gray-600 border-2 border-[#222]' : ''}
                    ${isBoss && isLocked ? 'border-[#FFD400]/30 border-dashed' : ''}
                    transition-colors duration-500
                  `}
                >
                  <div className="-rotate-45 flex flex-col items-center justify-center">
                    {isAnimating ? (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
                      >
                        <Check size={isBoss ? 40 : 32} strokeWidth={4} />
                      </motion.div>
                    ) : isCompleted ? (
                      <Check size={isBoss ? 40 : 32} strokeWidth={4} />
                    ) : isCurrent ? (
                      <Play size={isBoss ? 40 : 32} strokeWidth={4} className="ml-1" />
                    ) : isBoss ? (
                      <Skull size={36} strokeWidth={2.5} className="text-[#FFD400]/50" />
                    ) : (
                      <motion.div
                        animate={isNext ? { rotate: [-5, 5, -5] } : {}}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Lock size={28} strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                </motion.button>

                {/* Node Title & XP */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute -bottom-10 flex flex-col items-center whitespace-nowrap
                    ${isCurrent ? 'text-[#FFD400] glow-text-yellow' : isCompleted ? 'text-white' : 'text-gray-600'}
                  `}
                >
                  <span className="font-black text-sm uppercase tracking-wider">{node.title}</span>
                  {(isCurrent || isNext) && (
                    <span className="text-[10px] font-bold text-[#FFD400]/80">+{node.xp} XP</span>
                  )}
                </motion.div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Floating XP Animation */}
      <AnimatePresence>
        {floatingXP && (
          <motion.div
            initial={{ opacity: 0, y: floatingXP.y, x: floatingXP.x - 30, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: floatingXP.y - 120, scale: [0.5, 1.3, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed z-50 text-[#FFD400] font-black text-3xl glow-text-yellow pointer-events-none drop-shadow-2xl"
          >
            +{floatingXP.amount} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Continue Button */}
      <div className="fixed bottom-24 left-0 right-0 px-6 z-40 flex justify-center pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,212,0,0.8)" }}
          whileTap={{ scale: 0.95, y: 5 }}
          animate={{ boxShadow: ["0 0 15px rgba(255,212,0,0.4)", "0 0 25px rgba(255,212,0,0.8)", "0 0 15px rgba(255,212,0,0.4)"] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="pointer-events-auto w-full max-w-sm bg-[#FFD400] text-[#050505] font-black text-lg py-4 rounded-2xl uppercase tracking-widest shadow-[0_10px_0_#B39500] relative overflow-hidden group"
        >
          <span className="relative z-10">Continuar</span>
          {/* Horizontal Shine Effect */}
          <motion.div 
            className="absolute top-0 left-0 w-1/2 h-full bg-white/40 skew-x-12 -translate-x-[150%]"
            animate={{ translateX: ['-150%', '250%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
          />
        </motion.button>
      </div>

      {/* Confetti Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 0 }}
          animate={{ 
            x: p.x + Math.cos(p.angle) * p.velocity, 
            y: p.y + Math.sin(p.angle) * p.velocity - 50,
            opacity: 0,
            scale: 1,
            rotate: p.rotation + 180
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed z-50 bg-[#FFD400] pointer-events-none shadow-[0_0_5px_rgba(255,212,0,0.8)]"
          style={{ width: p.size, height: p.size, borderRadius: p.size > 6 ? '50%' : '2px' }}
        />
      ))}

    </div>
  );
};
