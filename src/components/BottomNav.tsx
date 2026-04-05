import { NAV_ITEMS } from '../constants';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-6 left-6 right-6 bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 flex justify-around items-center shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="relative flex flex-col items-center justify-center w-16 h-16 rounded-[1.5rem] transition-all"
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 bg-[#FFD400]/10 rounded-[1.5rem] border border-[#FFD400]/20"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            )}
            <motion.div
              animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Icon 
                size={28} 
                className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-[#FFD400] drop-shadow-[0_0_8px_rgba(255,212,0,0.8)]' : 'text-gray-500'}`} 
              />
            </motion.div>
          </button>
        );
      })}
    </nav>
  );
};
