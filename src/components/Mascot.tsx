import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MascotProps {
  mood?: 'idle' | 'happy' | 'sad' | 'excited' | 'dead';
  size?: number;
  className?: string;
  message?: string;
}

export const Mascot: React.FC<MascotProps> = ({ mood = 'idle', size = 120, className = '', message }) => {
  const getEyes = () => {
    switch (mood) {
      case 'happy': 
        return <path d="M 30 45 Q 40 35 50 45 M 70 45 Q 80 35 90 45" stroke="#050505" strokeWidth="6" fill="none" strokeLinecap="round" />;
      case 'sad': 
        return <path d="M 30 40 Q 40 30 50 45 M 70 45 Q 80 30 90 40" stroke="#050505" strokeWidth="6" fill="none" strokeLinecap="round" />;
      case 'excited': 
        return <path d="M 30 40 L 40 50 L 50 40 M 70 40 L 80 50 L 90 40" stroke="#050505" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
      case 'dead': 
        return <path d="M 30 35 L 50 55 M 50 35 L 30 55 M 70 35 L 90 55 M 90 35 L 70 55" stroke="#050505" strokeWidth="6" fill="none" strokeLinecap="round" />;
      default: 
        return (
          <>
            <circle cx="40" cy="45" r="7" fill="#050505" />
            <circle cx="80" cy="45" r="7" fill="#050505" />
          </>
        );
    }
  };

  const getMouth = () => {
    switch (mood) {
      case 'happy': 
        return <path d="M 40 65 Q 60 85 80 65" stroke="#050505" strokeWidth="6" fill="none" strokeLinecap="round" />;
      case 'sad': 
        return <path d="M 45 75 Q 60 65 75 75" stroke="#050505" strokeWidth="6" fill="none" strokeLinecap="round" />;
      case 'excited': 
        return <path d="M 40 65 Q 60 95 80 65 Z" fill="#050505" stroke="#050505" strokeWidth="4" strokeLinejoin="round" />;
      case 'dead': 
        return <path d="M 45 70 L 75 70" stroke="#050505" strokeWidth="6" fill="none" strokeLinecap="round" />;
      default: 
        return <path d="M 45 65 Q 60 75 75 65" stroke="#050505" strokeWidth="6" fill="none" strokeLinecap="round" />;
    }
  };

  const getAnimation = () => {
    switch (mood) {
      case 'happy': return { y: [0, -10, 0], transition: { repeat: Infinity, duration: 1 } };
      case 'excited': return { y: [0, -20, 0], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.6 } };
      case 'sad': return { y: [0, 5, 0], transition: { repeat: Infinity, duration: 2 } };
      case 'dead': return { rotate: 180, transition: { duration: 0.5 } };
      default: return { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } };
    }
  };

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#050505] px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap shadow-xl border-2 border-[#FFD400] z-20"
          >
            {message}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="w-full h-full"
        animate={getAnimation()}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,212,0,0.4)]">
          {/* Body */}
          <circle cx="60" cy="60" r="50" fill="#FFD400" />
          {/* Highlight */}
          <path d="M 20 40 Q 60 5 100 40 A 40 40 0 0 0 20 40" fill="#FFE55C" opacity="0.6" />
          {/* Eyes */}
          {getEyes()}
          {/* Mouth */}
          {getMouth()}
          {/* Cheeks */}
          {(mood === 'happy' || mood === 'excited') && (
            <>
              <circle cx="25" cy="55" r="8" fill="#FF9900" opacity="0.5" />
              <circle cx="95" cy="55" r="8" fill="#FF9900" opacity="0.5" />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
