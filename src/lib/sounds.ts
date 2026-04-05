const SOUNDS = {
  XP: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  VICTORY: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  COMBO: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  BUTTON: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  CHEST: 'https://assets.mixkit.co/active_storage/sfx/1017/1017-preview.mp3',
};

export const playSound = (type: keyof typeof SOUNDS) => {
  try {
    const audio = new Audio(SOUNDS[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignore autoplay errors
    });
  } catch (e) {
    console.warn('Audio not supported', e);
  }
};
