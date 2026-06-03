/**
 * Menghitung Level dari total XP.
 * Formula: Level = floor(XP / 100) + 1
 */
export const calculateLevel = (xp: number): number => {
  if (xp < 0) return 1;
  return Math.floor(xp / 100) + 1;
};

/**
 * Menghitung batas XP untuk naik ke Level tertentu.
 * Karena tiap level butuh 100 XP, batas bawah level L adalah (L - 1) * 100.
 */
export const getXpForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return (level - 1) * 100;
};

/**
 * Mendapatkan Visual Stage (1-5) berdasarkan Level District
 */
export const getVisualStage = (level: number): number => {
  if (level >= 36) return 5;
  if (level >= 21) return 4;
  if (level >= 11) return 3;
  if (level >= 6) return 2;
  return 1;
};

/**
 * Mendapatkan XP berdasarkan tingkat kesulitan aktivitas
 */
export const getDifficultyXp = (difficulty: string): number => {
  switch (difficulty) {
    case 'Easy': return 10;
    case 'Medium': return 20;
    case 'Hard': return 40;
    default: return 0;
  }
};
