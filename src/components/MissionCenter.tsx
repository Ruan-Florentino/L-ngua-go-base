import React from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen, Target, Mic, Zap, Trophy, Star, Lock, ChevronRight, Cpu, Check } from 'lucide-react';
import { useMissionProgress, MissionStatus } from '../hooks/useMissionProgress';

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: any;
  xp: number;
  level: number;
}

const MISSION_DATA: Mission[] = [
  { 
    id: 'daily', 
    title: 'MISSÃO DO DIA', 
    description: 'Sincronização neural pendente. Complete os protocolos.',
    icon: Cpu, 
    xp: 1200, 
    level: 15, 
  },
  { 
    id: 'flashcards', 
    title: 'FLASHCARDS', 
    description: 'Upload de dados lexicais.',
    icon: BookOpen, 
    xp: 450, 
    level: 8, 
  },
  { 
    id: 'tapgame', 
    title: 'TAP GAME', 
    description: 'Teste de latência motora.',
    icon: Target, 
    xp: 600, 
    level: 10, 
  },
  { 
    id: 'falar', 
    title: 'PRÁTICA ORAL', 
    description: 'Calibração de sintetizador vocal.',
    icon: Mic, 
    xp: 800, 
    level: 12, 
  },
  { 
    id: 'frases', 
    title: 'MESTRE DE FRASES', 
    description: 'Compilação de estruturas sintáticas.',
    icon: Zap, 
    xp: 1500, 
    level: 14, 
  },
];

const CyberCard: React.FC<{ 
  mission: Mission; 
  status: MissionStatus;
  progress: number;
  isMain?: boolean;
  onClick?: () => void;
}> = ({ mission, status, progress, isMain = false, onClick }) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isAvailable = status === 'available' || status === 'in-progress';

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.02, x: 5 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      className={`
        relative w-full text-left transition-all duration-300 group
        ${isMain ? 'mb-8' : 'mb-4'}
        ${isLocked ? 'opacity-40 grayscale cursor-not-allowed' : ''}
      `}
    >
      {/* Cyberpunk Panel Shape */}
      <div 
        className={`
          absolute inset-0 bg-[#0a0a0a] border-l-4 
          ${isLocked ? 'border-gray-700' : isCompleted ? 'border-cyan-400' : 'border-[#FFD400]'}
          transition-colors duration-300
        `}
        style={{
          clipPath: 'polygon(0 0, 95% 0, 100% 20%, 100% 100%, 5% 100%, 0 80%)'
        }}
      />
      
      {/* Inner Tech Border */}
      <div 
        className={`
          absolute inset-[1px] bg-[#0d0d0d] opacity-90
          ${isLocked ? 'border-gray-800' : isCompleted ? 'border-cyan-400/20' : 'border-[#FFD400]/20'}
          border
        `}
        style={{
          clipPath: 'polygon(0 0, 95% 0, 100% 20%, 100% 100%, 5% 100%, 0 80%)'
        }}
      />

      {/* Scanline Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <motion.div 
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className={`w-full h-1/2 bg-gradient-to-b from-transparent ${isCompleted ? 'via-cyan-400' : 'via-[#FFD400]'} to-transparent`}
        />
      </div>

      <div className={`relative z-10 flex flex-col h-full ${isMain ? 'p-8' : 'p-5'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className={`
              relative flex items-center justify-center rounded-full border-2
              ${isLocked ? 'border-gray-700' : isCompleted ? 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'border-[#FFD400] shadow-[0_0_10px_rgba(255,212,0,0.3)]'}
              ${isMain ? 'w-16 h-16' : 'w-12 h-12'}
            `}>
              {isCompleted ? (
                <Check size={isMain ? 32 : 24} className="text-cyan-400" />
              ) : (
                <mission.icon size={isMain ? 32 : 24} className={isLocked ? 'text-gray-700' : 'text-[#FFD400]'} />
              )}
              {/* HUD Circle Decor */}
              <div className={`absolute inset-[-4px] border rounded-full border-dashed animate-spin-slow ${isLocked ? 'border-gray-800' : isCompleted ? 'border-cyan-400/20' : 'border-[#FFD400]/20'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-black tracking-[0.2em] ${isLocked ? 'text-gray-700' : isCompleted ? 'text-cyan-400' : 'text-cyan-400'}`}>
                  {isMain ? 'CRITICAL_PROTOCOL' : 'SIDE_TASK'}
                </span>
                <div className={`h-[1px] w-8 ${isLocked ? 'bg-gray-800' : isCompleted ? 'bg-cyan-400/30' : 'bg-cyan-400/30'}`} />
              </div>
              <h3 className={`font-black text-white uppercase tracking-tighter ${isMain ? 'text-2xl' : 'text-lg'}`}>
                {mission.title}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${isLocked ? 'text-gray-700' : isCompleted ? 'text-cyan-400' : 'text-[#FFD400]'}`}>
              REWARD_XP
            </span>
            <div className={`flex items-center gap-1 font-black italic ${isLocked ? 'text-gray-700' : isCompleted ? 'text-cyan-400' : 'text-[#FFD400] text-xl'}`}>
              <span>+{mission.xp}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          {/* Segmented Progress Bar */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30 italic">SYNC_STATUS</span>
              <span className={`text-[10px] font-black ${isLocked ? 'text-gray-700' : isCompleted ? 'text-cyan-400' : 'text-[#FFD400]'}`}>{progress}%</span>
            </div>
            <div className="flex gap-[2px] h-1.5 w-full">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className={`flex-1 transition-colors duration-500 ${
                    i < (progress / 5) 
                      ? (isLocked ? 'bg-gray-700' : isCompleted ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'bg-[#FFD400] shadow-[0_0_5px_rgba(255,212,0,0.5)]') 
                      : 'bg-white/5'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-1 h-3 ${isLocked ? 'bg-gray-800' : isCompleted ? 'bg-cyan-400/50' : 'bg-cyan-400/50'}`} />
              ))}
            </div>
            <div className={`
              flex items-center gap-2 px-4 py-1.5 border-r-4 transition-all
              ${isLocked ? 'bg-gray-900 border-gray-700 text-gray-700' : isCompleted ? 'bg-cyan-400 border-white text-black font-black uppercase text-[10px] italic' : 'bg-[#FFD400] border-cyan-400 text-black font-black uppercase text-[10px] italic shadow-[0_0_15px_rgba(255,212,0,0.3)]'}
            `}>
              {isLocked ? 'LOCKED' : isCompleted ? 'SYNC_COMPLETE' : 'EXECUTE_TASK'}
              {!isLocked && !isCompleted && <ChevronRight size={14} />}
              {isCompleted && <Check size={14} />}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export const MissionCenter: React.FC<{ onStartRunner?: () => void, onStartTap?: () => void }> = ({ onStartRunner, onStartTap }) => {
  const { progress: missionProgress, getNextMission, completeMission } = useMissionProgress();

  const handleContinue = () => {
    const next = getNextMission();
    if (next) {
      // Logic to open the mission based on its ID
      console.log(`Starting mission: ${next.id}`);
      if (next.id === 'tapgame') onStartTap?.();
      // Add other mission starts here
    }
  };

  const handleDebugComplete = () => {
    const next = getNextMission();
    if (next) {
      completeMission(next.id);
    }
  };

  const getMissionStatus = (id: string) => {
    const p = missionProgress.find(m => m.id === id);
    return p ? p.status : 'locked' as MissionStatus;
  };

  const getMissionProgress = (id: string) => {
    const p = missionProgress.find(m => m.id === id);
    return p ? p.progress : 0;
  };

  const dailyMission = MISSION_DATA.find(m => m.id === 'daily')!;
  const otherMissions = MISSION_DATA.filter(m => m.id !== 'daily');

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[600px] p-6 font-mono overflow-hidden bg-[#050505] text-white">
      {/* Cyber Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: `linear-gradient(#FFD400 1px, transparent 1px), linear-gradient(90deg, #FFD400 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-[#FFD400]/5 to-transparent opacity-50" />
      </div>

      {/* Header HUD */}
      <div className="relative z-10 mb-10 flex items-center justify-between border-b-2 border-[#FFD400]/20 pb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.4em]">NETWORK_STATUS: ACTIVE</span>
          </div>
          <h2 className="text-white font-black text-3xl uppercase tracking-tighter italic">MISSION_HUB</h2>
        </div>
        <div className="flex items-center gap-4 bg-black border border-[#FFD400]/30 p-2 shadow-[0_0_20px_rgba(255,212,0,0.1)]">
          <div className="w-10 h-10 border border-[#FFD400]/50 flex items-center justify-center bg-[#FFD400]/5">
            <Trophy size={20} className="text-[#FFD400] drop-shadow-[0_0_5px_rgba(255,212,0,0.5)]" />
          </div>
          <div className="flex flex-col pr-2">
            <span className="text-[#FFD400] font-black text-xl leading-none italic">1.240</span>
            <span className="text-white/30 text-[8px] font-black uppercase tracking-widest mt-1 italic">CREDITS</span>
          </div>
        </div>
      </div>

      {/* Missions Layout */}
      <div className="relative z-10">
        <CyberCard 
          mission={dailyMission} 
          status={getMissionStatus(dailyMission.id)}
          progress={getMissionProgress(dailyMission.id)}
          isMain 
        />

        <div className="flex flex-col">
          {otherMissions.map((mission) => (
            <CyberCard 
              key={mission.id} 
              mission={mission} 
              status={getMissionStatus(mission.id)}
              progress={getMissionProgress(mission.id)}
              onClick={mission.id === 'tapgame' ? onStartTap : undefined}
            />
          ))}
        </div>

        {/* Continuar Jornada Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full mt-6 relative group"
        >
          <div 
            className="absolute inset-0 bg-[#FFD400] shadow-[0_0_20px_rgba(255,212,0,0.4)]"
            style={{ clipPath: 'polygon(0 0, 90% 0, 100% 100%, 10% 100%)' }}
          />
          <div className="relative py-4 flex items-center justify-center gap-3 text-black font-black uppercase italic tracking-widest">
            <Zap size={20} fill="black" />
            CONTINUAR JORNADA
            <ChevronRight size={20} />
          </div>
          {/* Glitch Decor */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400" />
        </motion.button>

        {/* Debug Completion Button (Temporary for testing) */}
        <button 
          onClick={handleDebugComplete}
          className="mt-4 text-[8px] font-black text-cyan-400/30 uppercase tracking-widest hover:text-cyan-400 transition-colors"
        >
          [DEBUG: COMPLETE_CURRENT_PROTOCOL]
        </button>
      </div>

      {/* Footer Decor */}
      <div className="relative z-10 mt-12 flex flex-col items-center gap-4 opacity-20">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFD400] to-transparent" />
        <p className="text-[#FFD400] text-[8px] font-black tracking-[0.6em] uppercase italic">LINGUAGO_OS // BUILD_2077</p>
      </div>
    </div>
  );
};
