import { Home, BookOpen, Trophy, User } from 'lucide-react';
import { Rank, GameEvent } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'tasks', label: 'Tarefas', icon: BookOpen },
  { id: 'ranking', label: 'Ranking', icon: Trophy },
  { id: 'profile', label: 'Perfil', icon: User },
];

export const RANKS: Rank[] = [
  { type: 'Iniciante', minXP: 0, badge: '🌱', color: '#94A3B8' },
  { type: 'Explorador', minXP: 500, badge: '🧭', color: '#22C55E' },
  { type: 'Fluente', minXP: 1500, badge: '🗣️', color: '#3B82F6' },
  { type: 'Elite', minXP: 3500, badge: '🛡️', color: '#A855F7' },
  { type: 'Mestre', minXP: 7000, badge: '👑', color: '#F59E0B' },
  { type: 'Lendário', minXP: 15000, badge: '💎', color: '#FFD400' },
  { type: 'Imortal', minXP: 30000, badge: '🔥', color: '#EF4444' },
];

export const STREAK_REWARDS = {
  3: { multiplier: 1.1, label: '+10% XP' },
  7: { multiplier: 1.2, label: '+20% XP' },
  15: { multiplier: 1.5, label: '+50% XP' },
  30: { multiplier: 2.0, label: 'Avatar Raro + x2 XP', special: 'rare_avatar' },
};

export const CURRENT_EVENT: GameEvent = {
  id: 'weekly-challenge',
  title: 'Semana do Inglês',
  description: 'Ganhe 2x XP em todas as missões!',
  multiplier: 2,
  type: 'xp',
  endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
};
