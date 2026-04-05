/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { Home } from './screens/Home';
import { Missions } from './screens/Missions';
import { Ranking } from './screens/Ranking';
import { Profile } from './screens/Profile';
import { TapGame } from './screens/TapGame';
import { RunnerGame } from './screens/RunnerGame';
import { ChestReveal } from './components/ChestReveal';
import { Shop } from './components/Shop';
import { RANKS, CURRENT_EVENT } from './constants';
import { RankType } from './types';
import { playSound } from './lib/sounds';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [tapGameScore, setTapGameScore] = useState(0);
  
  // Global App State
  const [totalXP, setTotalXP] = useState(2400);
  const [coins, setCoins] = useState(150);
  const [streak, setStreak] = useState(12);
  const [hasStreakShield, setHasStreakShield] = useState(false);
  const [lastRank, setLastRank] = useState<string | null>(null);
  const [runnerBestScore, setRunnerBestScore] = useState(() => {
    const saved = localStorage.getItem('runnerBestScore');
    return saved ? parseInt(saved) : 0;
  });

  // Rank Calculation
  const currentRank = [...RANKS].reverse().find(r => totalXP >= r.minXP) || RANKS[0];

  // Check for Rank Up
  useEffect(() => {
    if (lastRank && currentRank.type !== lastRank) {
      playSound('VICTORY');
      // Could add a rank up modal here
    }
    setLastRank(currentRank.type);
  }, [currentRank.type]);

  // Chest State
  const [activeChest, setActiveChest] = useState<{ rarity: 'common' | 'rare' | 'epic' | 'legendary', xp: number, coins: number } | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  // Sound on tab change
  useEffect(() => {
    playSound('BUTTON');
  }, [activeTab]);

  if (activeChest) {
    return <ChestReveal 
      rarity={activeChest.rarity} 
      xp={activeChest.xp} 
      coins={activeChest.coins} 
      onComplete={() => {
        setTotalXP(prev => prev + activeChest.xp);
        setCoins(prev => prev + activeChest.coins);
        setActiveChest(null);
        playSound('XP');
      }} 
    />;
  }

  if (activeSession === 'tap-game') {
    return <TapGame onClose={(score) => {
      setTapGameScore(prev => prev + score);
      setActiveSession(null);
      if (score > 0) playSound('VICTORY');
    }} />;
  }

  if (activeSession === 'runner-game') {
    return <RunnerGame 
      bestScore={runnerBestScore}
      onClose={(score, xp) => {
        setTotalXP(prev => prev + xp);
        setCoins(prev => prev + Math.floor(score / 10)); // Bonus coins from runner
        if (score > runnerBestScore) {
          setRunnerBestScore(score);
          localStorage.setItem('runnerBestScore', score.toString());
        }
        setActiveSession(null);
        playSound('VICTORY');
      }} 
    />;
  }

  if (showShop) {
    return <Shop 
      coins={coins} 
      ownedItems={ownedItems}
      onClose={() => setShowShop(false)}
      onPurchase={(item) => {
        setCoins(prev => prev - item.price);
        setOwnedItems(prev => [...prev, item.id]);
        if (item.id === 'shield-streak') {
          setHasStreakShield(true);
        }
        playSound('VICTORY');
      }}
    />;
  }

  const renderScreen = () => {
    const commonProps = {
      totalXP,
      coins,
      streak,
      rank: currentRank,
      event: CURRENT_EVENT
    };

    switch (activeTab) {
      case 'home': 
        return <Home 
          {...commonProps}
          onStartTapGame={() => setActiveSession('tap-game')} 
          onStartRunnerGame={() => setActiveSession('runner-game')}
          onOpenShop={() => setShowShop(true)}
        />;
      case 'tasks': 
        return <Missions 
          onStartTapGame={() => setActiveSession('tap-game')} 
          tapGameScore={tapGameScore} 
          onMissionComplete={(xp, rewardCoins, rarity) => {
            setActiveChest({ rarity, xp, coins: rewardCoins });
            playSound('CHEST');
          }}
        />;
      case 'ranking': 
        return <Ranking bestScore={runnerBestScore} />;
      case 'profile': 
        return <Profile totalXP={totalXP} rank={currentRank.type} />;
      default: 
        return <Home 
          {...commonProps}
          onStartTapGame={() => setActiveSession('tap-game')} 
          onStartRunnerGame={() => setActiveSession('runner-game')}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-28">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
