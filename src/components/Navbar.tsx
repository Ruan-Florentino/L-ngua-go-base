import React from 'react';
import { Map, Target, Trophy, User } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'journey', icon: Map, label: 'Jornada' },
    { id: 'missions', icon: Target, label: 'Missões' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
      <div className="flex justify-around items-center h-20 px-2 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-20 h-full group outline-none"
            >
              {/* Animated Background Indicator */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-2 bg-[#FFD400]/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              
              {/* Icon Container */}
              <motion.div
                animate={{ 
                  scale: isActive ? 1.2 : 1,
                  y: isActive ? -4 : 0,
                  color: isActive ? '#FFD400' : '#6B7280'
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`relative z-10 transition-colors duration-300 ${isActive ? 'drop-shadow-[0_0_10px_rgba(255,212,0,0.6)]' : 'group-hover:text-gray-400'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              
              {/* Label */}
              <motion.span 
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  scale: isActive ? 1 : 0.9,
                  color: isActive ? '#FFD400' : '#6B7280'
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-[10px] font-bold mt-1 z-10"
              >
                {item.label}
              </motion.span>
              
              {/* Active Dot */}
              {isActive && (
                <motion.div 
                  layoutId="nav-dot"
                  className="absolute bottom-2 w-1 h-1 bg-[#FFD400] rounded-full shadow-[0_0_8px_rgba(255,212,0,1)]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
