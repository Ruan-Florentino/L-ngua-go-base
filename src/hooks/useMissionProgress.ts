import { useState, useEffect } from 'react';

export type MissionStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface MissionProgress {
  id: string;
  status: MissionStatus;
  progress: number;
}

const MISSION_IDS = ['daily', 'flashcards', 'tapgame', 'falar', 'frases'];

const STORAGE_KEY = 'linguago_mission_progress';

export const useMissionProgress = () => {
  const [progress, setProgress] = useState<MissionProgress[]>([]);

  // Initialize or load from storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const lastReset = localStorage.getItem(STORAGE_KEY + '_reset');
    const now = new Date();
    const today = now.toDateString();

    // Daily Reset Logic
    if (lastReset !== today) {
      const initialProgress: MissionProgress[] = MISSION_IDS.map((id, index) => ({
        id,
        status: index === 0 ? 'available' : 'locked',
        progress: 0,
      }));
      setProgress(initialProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProgress));
      localStorage.setItem(STORAGE_KEY + '_reset', today);
    } else if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const updateMissionProgress = (id: string, newProgress: number) => {
    setProgress((prev) => {
      const next = prev.map((m) => {
        if (m.id === id) {
          const isCompleted = newProgress >= 100;
          return { 
            ...m, 
            progress: Math.min(newProgress, 100),
            status: isCompleted ? 'completed' : 'in-progress' as MissionStatus
          };
        }
        return m;
      });

      // Unlock next mission if current is completed
      const currentIndex = MISSION_IDS.indexOf(id);
      if (newProgress >= 100 && currentIndex < MISSION_IDS.length - 1) {
        const nextId = MISSION_IDS[currentIndex + 1];
        const nextMission = next.find(m => m.id === nextId);
        if (nextMission && nextMission.status === 'locked') {
          nextMission.status = 'available';
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return [...next];
    });
  };

  const completeMission = (id: string) => {
    updateMissionProgress(id, 100);
  };

  const getNextMission = () => {
    return progress.find(m => m.status === 'available' || m.status === 'in-progress') || progress[0];
  };

  return {
    progress,
    updateMissionProgress,
    completeMission,
    getNextMission,
  };
};
