import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Zap, Shield, Sparkles, Coins, ArrowLeft, Check } from 'lucide-react';
import { playSound } from '../lib/sounds';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  color: string;
  type: 'skin' | 'effect' | 'booster';
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'skin-gold',
    name: 'Mascote de Ouro',
    description: 'Uma skin lendária para o seu mascote.',
    price: 1000,
    icon: <Sparkles className="text-yellow-400" />,
    color: '#FFD400',
    type: 'skin'
  },
  {
    id: 'effect-rainbow',
    name: 'Rastro Arco-Íris',
    description: 'Efeito visual incrível no Runner Game.',
    price: 500,
    icon: <Zap className="text-purple-400" />,
    color: '#A855F7',
    type: 'effect'
  },
  {
    id: 'booster-xp',
    name: 'Poção de XP',
    description: 'Dobra o XP ganho por 1 hora.',
    price: 300,
    icon: <Star className="text-blue-400" />,
    color: '#3B82F6',
    type: 'booster'
  },
  {
    id: 'shield-streak',
    name: 'Escudo de Streak',
    description: 'Protege sua streak por 1 dia se você esquecer.',
    price: 800,
    icon: <Shield className="text-green-400" />,
    color: '#22C55E',
    type: 'booster'
  }
];

interface ShopProps {
  coins: number;
  onPurchase: (item: ShopItem) => void;
  onClose: () => void;
  ownedItems: string[];
}

export const Shop: React.FC<ShopProps> = ({ coins, onPurchase, onClose, ownedItems }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 bg-[#050505] z-[60] flex flex-col font-sans"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 bg-white/5 rounded-xl text-white"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <h1 className="text-white font-black text-2xl uppercase tracking-wider">Loja</h1>
        </div>
        
        <div className="flex items-center gap-2 bg-[#FFD400]/10 px-4 py-2 rounded-full border border-[#FFD400]/20">
          <Coins size={20} className="text-[#FFD400]" />
          <span className="text-[#FFD400] font-black text-lg">{coins}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-6">
          {SHOP_ITEMS.map((item) => {
            const isOwned = ownedItems.includes(item.id);
            const canAfford = coins >= item.price;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111] border border-white/5 rounded-3xl p-6 relative overflow-hidden group"
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40"
                  style={{ backgroundColor: item.color }}
                />
                
                <div className="flex items-start gap-6 relative z-10">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0"
                    style={{ backgroundColor: `${item.color}20`, border: `2px solid ${item.color}40` }}
                  >
                    {item.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-black text-xl">{item.name}</h3>
                      <span className="text-white/30 font-bold text-xs uppercase tracking-widest">{item.type}</span>
                    </div>
                    <p className="text-white/50 text-sm font-medium mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins size={16} className="text-[#FFD400]" />
                        <span className="text-[#FFD400] font-black text-lg">{item.price}</span>
                      </div>
                      
                      <motion.button
                        whileHover={!isOwned && canAfford ? { scale: 1.05 } : {}}
                        whileTap={!isOwned && canAfford ? { scale: 0.95 } : {}}
                        onClick={() => !isOwned && canAfford && onPurchase(item)}
                        disabled={isOwned || !canAfford}
                        className={`px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                          isOwned 
                            ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                            : canAfford
                              ? 'bg-[#FFD400] text-[#050505] shadow-[0_5px_0_#B39500]'
                              : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        {isOwned ? (
                          <span className="flex items-center gap-2">Adquirido <Check size={16} /></span>
                        ) : (
                          'Comprar'
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
