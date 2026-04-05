import React, { useState, useEffect } from 'react';
import { CheckCircle, Gift, Coins, Star, Clock, Layers, MessageSquare, MousePointerClick, Mic, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

type Position = 'top' | 'right' | 'bottom' | 'left';

interface Mission {
  id: number;
  title: string;
  progress: number;
  total: number;
  xp: number;
  completed: boolean;
  icon: any;
  pos: Position;
}

const initialMissions: Mission[] = [
  { id: 1, title: 'Flashcards', progress: 10, total: 20, xp: 10, completed: false, icon: Layers, pos: 'top' },
  { id: 2, title: 'Frases', progress: 3, total: 5, xp: 20, completed: false, icon: MessageSquare, pos: 'right' },
  { id: 3, title: 'Tap Game', progress: 0, total: 500, xp: 10, completed: false, icon: MousePointerClick, pos: 'bottom' },
  { id: 4, title: 'Falar', progress: 0, total: 3, xp: 40, completed: false, icon: Mic, pos: 'left' },
];

const CircularProgress = ({ progress, size, strokeWidth, isCompleted, color = "#FFD400", trackColor = "#111", className = "", glow = false }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress * circumference);

  return (
    <svg width={size} height={size} className={`transform -rotate-90 ${className} overflow-visible`}>
      {glow && isCompleted && (
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" className="blur-[8px] opacity-50" />
      )}
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} // Custom spring-like ease
        strokeLinecap="round"
        className={isCompleted ? "drop-shadow-[0_0_12px_rgba(255,212,0,0.8)]" : ""}
      />
    </svg>
  );
};

export const Missions = ({ 
  onStartTapGame, 
  tapGameScore = 0,
  onMissionComplete 
}: { 
  onStartTapGame?: () => void;
  tapGameScore?: number;
  onMissionComplete?: (xp: number, coins: number, rarity: 'common' | 'rare' | 'epic' | 'legendary') => void;
}) => {
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [animatingMissionId, setAnimatingMissionId] = useState<number | null>(null);
  const [floatingXP, setFloatingXP] = useState<{id: number, x: number, y: number, amount: number} | null>(null);
  const [chestOpen, setChestOpen] = useState(false);
  const [pulses, setPulses] = useState<{id: number, startX: number, startY: number}[]>([]);
  const [coreShake, setCoreShake] = useState(false);

  // Sync tapGameScore to the Tap Game mission
  useEffect(() => {
    if (tapGameScore > 0) {
      setMissions(prev => {
        const mission = prev.find(m => m.id === 3);
        if (mission && !mission.completed) {
          const newProgress = Math.min(mission.total, mission.progress + tapGameScore);
          if (newProgress >= mission.total) {
            // Trigger animation
            setAnimatingMissionId(3);
            setFloatingXP({ id: 3, x: 160, y: 310, amount: mission.xp });
            setPulses(p => [...p, { id: Date.now(), startX: 160, startY: 310 }]);
            
            setTimeout(() => {
              setAnimatingMissionId(null);
              if (onMissionComplete) {
                // Determine rarity based on mission
                const rarity = 'rare';
                const coins = 15;
                onMissionComplete(mission.xp, coins, rarity);
              }
            }, 1000);
            return prev.map(m => m.id === 3 ? { ...m, progress: newProgress, completed: true } : m);
          }
          return prev.map(m => m.id === 3 ? { ...m, progress: newProgress } : m);
        }
        return prev;
      });
    }
  }, [tapGameScore, onMissionComplete]);

  // Calculate actual completed count based on state
  const completedCount = missions.filter(m => m.completed).length;
  const allCompleted = completedCount === missions.length;
  const isCritical = completedCount === missions.length - 1; // 3/4 completed

  useEffect(() => {
    if (allCompleted && !chestOpen) {
      setTimeout(() => {
        handleOpenChest();
      }, 1800); // Wait for final pulse and core fill
    }
  }, [allCompleted]);

  const handleCompleteMission = (id: number, event: React.MouseEvent, xp: number, pos: Position) => {
    if (animatingMissionId) return;
    
    if (navigator.vibrate) navigator.vibrate(50);
    
    const rect = event.currentTarget.getBoundingClientRect();
    setAnimatingMissionId(id);
    
    // 1. Spawn Floating XP immediately
    setFloatingXP({ id, x: rect.left + rect.width / 2, y: rect.top, amount: xp });
    
    // 2. Spawn Energy Pulse traveling to center
    const coords = {
      top: { x: 160, y: 10 },
      right: { x: 310, y: 160 },
      bottom: { x: 160, y: 310 },
      left: { x: 10, y: 160 },
    }[pos];
    
    const pulseId = Date.now();
    setPulses(prev => [...prev, { id: pulseId, startX: coords.x, startY: coords.y }]);

    // 3. Update mission state (fills its own circle)
    setMissions(prev => prev.map(m => 
      m.id === id ? { ...m, progress: m.total, completed: true } : m
    ));

    // 4. After pulse hits center, shake core
    setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
      setCoreShake(true);
      setTimeout(() => setCoreShake(false), 300);
      setPulses(prev => prev.filter(p => p.id !== pulseId));
    }, 600); // Matches pulse animation duration

    // 5. Cleanup animation state
    setTimeout(() => {
      setAnimatingMissionId(null);
      setFloatingXP(null);
    }, 1200);
  };

  const handleOpenChest = () => {
    if (allCompleted && !chestOpen) {
      if (navigator.vibrate) navigator.vibrate([50, 100, 50, 100, 50]);
      setChestOpen(true);
      
      // Epic Confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#FFD400', '#FFFFFF', '#FFA500']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#FFD400', '#FFFFFF', '#FFA500']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] relative pb-32 overflow-x-hidden font-sans flex flex-col selection:bg-[#FFD400]/30">
      
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />

      {/* Background Grid & Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Radial Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,212,0,0.05)_0%,transparent_60%)]" />
        
        {/* Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        {/* Rising Data Embers */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[10px] bg-[#FFD400] rounded-full glow-yellow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              y: [0, -200],
              opacity: [0, 0.8, 0],
              height: [10, 30, 10]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 4,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="pt-14 pb-4 px-6 flex flex-col items-center text-center relative z-10">
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-10 w-64 h-16 bg-[#FFD400] blur-[70px] -z-10 rounded-full"
        />
        <h1 className="text-3xl font-black text-white uppercase tracking-[0.3em] drop-shadow-[0_0_20px_rgba(255,212,0,0.6)] flex items-center gap-3">
          <Target className="text-[#FFD400]" size={28} />
          Missões
        </h1>
        
        {/* Digital Timer */}
        <div className="flex items-center gap-2 mt-4 bg-[#0a0a0a] border border-[#FFD400]/30 px-6 py-2.5 rounded-lg shadow-[0_0_20px_rgba(255,212,0,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD400]/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          <Clock size={14} className="text-[#FFD400]" />
          <span className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">
            Reset: <span className="text-[#FFD400] font-mono text-sm ml-1 tracking-wider drop-shadow-[0_0_5px_rgba(255,212,0,0.8)]">13:22:45</span>
          </span>
        </div>
      </div>

      {/* Radial HUD Layout (The Reactor) */}
      <div className="relative w-[320px] h-[320px] mx-auto mt-16 mb-24 z-10">
        
        {/* Radar Sweep Background */}
        <motion.div
          className="absolute inset-0 m-auto w-[280px] h-[280px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(255, 212, 0, 0.4) 100%)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Rotating Tech Rings */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
          className="absolute inset-0 m-auto w-[220px] h-[220px] rounded-full border border-[#FFD400]/20 border-dashed pointer-events-none" 
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
          className="absolute inset-0 m-auto w-[280px] h-[280px] rounded-full border-[2px] border-white/5 border-dotted pointer-events-none" 
        />

        {/* Connecting Lines & Energy Pulses SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {missions.map(mission => {
            const coords = {
              top: { x2: 160, y2: 10 },
              right: { x2: 310, y2: 160 },
              bottom: { x2: 160, y2: 310 },
              left: { x2: 10, y2: 160 },
            }[mission.pos];
            
            const inProgress = mission.progress > 0 && !mission.completed;

            return (
              <g key={`line-${mission.id}`}>
                {/* Base Circuit Line */}
                <line x1="160" y1="160" x2={coords.x2} y2={coords.y2} stroke="#111" strokeWidth="4" strokeLinecap="round" />
                <line x1="160" y1="160" x2={coords.x2} y2={coords.y2} stroke="#222" strokeWidth="1" strokeLinecap="round" />
                
                {/* Active/Completed Energy Line */}
                {(inProgress || mission.completed) && (
                  <motion.line
                    x1="160" y1="160" x2={coords.x2} y2={coords.y2}
                    stroke="#FFD400" strokeWidth="2"
                    strokeDasharray={mission.completed ? "none" : "8 8"}
                    animate={mission.completed ? {} : { strokeDashoffset: [0, -32] }}
                    transition={mission.completed ? {} : { repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="drop-shadow-[0_0_10px_rgba(255,212,0,0.8)]"
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}

          {/* Traveling Energy Pulses */}
          <AnimatePresence>
            {pulses.map(pulse => (
              <motion.circle
                key={pulse.id}
                r="6"
                fill="#FFFFFF"
                filter="url(#glow)"
                initial={{ cx: pulse.startX, cy: pulse.startY, scale: 0 }}
                animate={{ cx: 160, cy: 160, scale: [0, 1.5, 1] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeIn" }}
                className="drop-shadow-[0_0_15px_rgba(255,212,0,1)]"
              />
            ))}
          </AnimatePresence>
        </svg>

        {/* Central Reactor Core */}
        <motion.div 
          animate={coreShake ? { x: [-4, 4, -4, 4, 0], y: [-2, 2, -2, 2, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 m-auto w-40 h-40 rounded-full bg-[#050505] flex items-center justify-center z-20 shadow-[0_0_50px_rgba(0,0,0,1),inset_0_0_20px_rgba(255,212,0,0.1)] border-2 border-[#111]"
        >
          {/* Core Inner Glow (Breathing if critical) */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-[#FFD400]/10"
            animate={isCritical ? { scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] } : { opacity: 0.1 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />

          <CircularProgress
            progress={completedCount / missions.length}
            size={160}
            strokeWidth={8}
            isCompleted={allCompleted}
            glow={true}
            className="absolute inset-0 -m-[2px]" // Offset border
          />
          
          <AnimatePresence mode="wait">
            {allCompleted ? (
              <motion.div
                key="chest"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 100 }}
                className="cursor-pointer flex flex-col items-center justify-center w-full h-full rounded-full bg-gradient-to-b from-[#FFD400]/20 to-transparent"
                onClick={handleOpenChest}
              >
                <motion.div
                  animate={{ y: [-3, 3, -3], scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="relative"
                >
                  <motion.div 
                    className="absolute inset-0 bg-[#FFD400] blur-[20px] opacity-60 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <Gift size={64} className="text-[#FFD400] drop-shadow-[0_0_25px_rgba(255,212,0,1)] relative z-10" strokeWidth={1.5} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="counter"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="flex flex-col items-center justify-center relative z-10"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,212,0,0.4)] tracking-tighter">
                    {completedCount}
                  </span>
                  <span className="text-3xl font-bold text-gray-600">/4</span>
                </div>
                <span className="text-[10px] font-black text-[#FFD400] uppercase tracking-[0.3em] mt-1 drop-shadow-[0_0_5px_rgba(255,212,0,0.8)]">
                  Missões
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Orbiting Mission Nodes */}
        {missions.map((mission) => {
          const inProgress = mission.progress > 0 && !mission.completed;
          const isAnimating = animatingMissionId === mission.id;
          const Icon = mission.icon;

          let posClasses = "";
          if (mission.pos === 'top') posClasses = "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2";
          if (mission.pos === 'right') posClasses = "top-1/2 right-0 translate-x-1/2 -translate-y-1/2";
          if (mission.pos === 'bottom') posClasses = "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2";
          if (mission.pos === 'left') posClasses = "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2";

          return (
            <div key={mission.id} className={`absolute ${posClasses} flex flex-col items-center justify-center z-30`}>
              
              {/* Node Container */}
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  if (!mission.completed) {
                    if (mission.id === 3 && onStartTapGame) {
                      onStartTapGame();
                    } else {
                      handleCompleteMission(mission.id, e, mission.xp, mission.pos);
                    }
                  }
                }}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer bg-[#050505] border-2 border-[#111]
                  ${mission.completed ? 'shadow-[0_0_30px_rgba(255,212,0,0.3)]' : 'shadow-[0_0_20px_rgba(0,0,0,0.9)]'}
                `}
              >
                {/* Rotating Outer Dashed Ring for Active Missions */}
                {inProgress && !mission.completed && (
                  <motion.div 
                    className="absolute -inset-2 rounded-full border border-[#FFD400]/40 border-dashed pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                )}

                <CircularProgress
                  progress={mission.progress / mission.total}
                  size={80}
                  strokeWidth={4}
                  isCompleted={mission.completed}
                  className="absolute inset-0 -m-[2px]"
                  glow={true}
                />
                
                {/* Inner Core Glow */}
                {inProgress && !mission.completed && (
                  <motion.div
                    className="absolute inset-2 rounded-full bg-[#FFD400]/20 blur-md"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}

                {/* Completion Flash Explosion */}
                {isAnimating && (
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 2.5] }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                )}

                <AnimatePresence mode="wait">
                  {mission.completed ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="text-[#FFD400] drop-shadow-[0_0_12px_rgba(255,212,0,1)] relative z-10"
                    >
                      <CheckCircle size={32} strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      className={`relative z-10 ${inProgress ? "text-[#FFD400] drop-shadow-[0_0_8px_rgba(255,212,0,0.8)]" : "text-gray-600"}`}
                    >
                      <Icon size={28} strokeWidth={inProgress ? 2.5 : 2} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Holographic Labels */}
              <div className={`absolute flex flex-col items-center w-36 pointer-events-none
                ${mission.pos === 'top' ? 'bottom-full mb-3' : ''}
                ${mission.pos === 'bottom' ? 'top-full mt-3' : ''}
                ${mission.pos === 'left' ? 'right-full mr-3' : ''}
                ${mission.pos === 'right' ? 'left-full ml-3' : ''}
              `}>
                <div className={`px-3 py-1 rounded-full border backdrop-blur-sm
                  ${mission.completed ? 'bg-[#FFD400]/10 border-[#FFD400]/30' : 'bg-[#111]/80 border-white/5'}
                `}>
                  <span className={`font-black text-[10px] uppercase tracking-[0.2em] text-center block
                    ${mission.completed ? 'text-[#FFD400] drop-shadow-[0_0_5px_rgba(255,212,0,0.8)]' : 'text-gray-400'}
                  `}>
                    {mission.title}
                  </span>
                </div>
                <div className={`flex items-center gap-1 mt-1.5 font-mono text-[11px] font-bold
                  ${mission.completed ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-gray-600'}
                `}>
                  <Zap size={10} className={mission.completed ? "text-[#FFD400]" : ""} />
                  {mission.xp} XP
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating XP Animation */}
      <AnimatePresence>
        {floatingXP && (
          <motion.div
            initial={{ opacity: 0, y: floatingXP.y, x: floatingXP.x, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: floatingXP.y - 150, scale: [0.5, 1.8, 1.2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed z-50 text-white font-black text-5xl pointer-events-none drop-shadow-[0_0_30px_rgba(255,212,0,1)] flex items-center gap-2"
            style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
          >
            <span className="text-[#FFD400]">+</span>{floatingXP.amount}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Epic Chest Open Overlay */}
      <AnimatePresence>
        {chestOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#030303]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
          >
            {/* Scanlines over modal */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />

            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative flex flex-col items-center w-full max-w-sm z-10"
            >
              {/* Massive Radiant Glow */}
              <motion.div 
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6], rotate: [0, 180, 360] }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FFD400] blur-[120px] rounded-full -z-10"
              />
              
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative mb-12"
              >
                <Gift size={180} className="text-[#FFD400] drop-shadow-[0_0_60px_rgba(255,212,0,1)]" strokeWidth={1} />
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ scale: [1, 1.3, 1], opacity: [0, 0.8, 0], rotate: [0, 90, 180] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                >
                  <Star size={100} className="text-white opacity-60" />
                </motion.div>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-white uppercase tracking-[0.2em] mb-12 text-center drop-shadow-2xl leading-tight"
              >
                Recompensa<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] to-[#FFF5B3] drop-shadow-[0_0_15px_rgba(255,212,0,0.8)] text-5xl">
                  Épica!
                </span>
              </motion.h2>

              <div className="flex gap-4 w-full">
                <motion.div 
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", delay: 0.6, bounce: 0.5 }}
                  className="flex-1 bg-[#0a0a0a] border border-[#FFD400]/40 p-6 rounded-3xl flex flex-col items-center shadow-[0_0_40px_rgba(255,212,0,0.2),inset_0_0_20px_rgba(255,212,0,0.1)] relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#FFD400]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <motion.div animate={{ rotateY: [0, 360] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                    <Zap size={48} className="text-[#FFD400] fill-[#FFD400] mb-4 drop-shadow-[0_0_20px_rgba(255,212,0,0.8)]" />
                  </motion.div>
                  <span className="text-white font-black text-5xl mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">+80</span>
                  <span className="text-[#FFD400] font-bold text-[10px] uppercase tracking-[0.2em]">XP Total</span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", delay: 0.8, bounce: 0.5 }}
                  className="flex-1 bg-[#0a0a0a] border border-[#FFD400]/40 p-6 rounded-3xl flex flex-col items-center shadow-[0_0_40px_rgba(255,212,0,0.2),inset_0_0_20px_rgba(255,212,0,0.1)] relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#FFD400]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <motion.div animate={{ rotateY: [0, 360] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 0.5 }}>
                    <Coins size={48} className="text-[#FFD400] mb-4 drop-shadow-[0_0_20px_rgba(255,212,0,0.8)]" />
                  </motion.div>
                  <span className="text-white font-black text-5xl mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">+100</span>
                  <span className="text-[#FFD400] font-bold text-[10px] uppercase tracking-[0.2em]">Moedas</span>
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(255,212,0,0.6)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setChestOpen(false)}
                className="mt-12 w-full bg-gradient-to-r from-[#FFD400] to-[#FFB800] text-[#050505] font-black text-xl py-6 rounded-2xl uppercase tracking-[0.3em] shadow-[0_8px_0_#B38000] active:shadow-[0_0px_0_#B38000] active:translate-y-2 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">Coletar Tudo</span>
                <motion.div 
                  className="absolute inset-0 bg-white/40 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]"
                />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
