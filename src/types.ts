export type Language = 'Inglês' | 'Espanhol' | 'Francês' | 'Alemão' | 'Italiano' | 'Russo';

export type RankType = 'Iniciante' | 'Explorador' | 'Fluente' | 'Elite' | 'Mestre' | 'Lendário' | 'Imortal';

export interface Rank {
  type: RankType;
  minXP: number;
  badge: string;
  color: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  multiplier: number;
  type: 'xp' | 'coins' | 'challenge';
  endsAt: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  coins: number;
  rank: RankType;
}
