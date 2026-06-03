/**
 * Menghitung Level dari total XP.
 * Formula: Level = floor((sqrt(225 + 4 * XP) - 5) / 10) + 1
 */
export const calculateLevel = (xp: number): number => {
  if (xp < 0) return 1;
  const levelFloat = (Math.sqrt(225 + 4 * xp) - 5) / 10;
  return Math.floor(levelFloat) + 1;
};

/**
 * Menghitung batas XP untuk naik ke Level tertentu.
 */
export const getXpForLevel = (level: number): number => {
  if (level <= 1) return 0;
  const l = level - 1; 
  return 25 * l * l + 25 * l - 50;
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
    case 'Medium': return 25;
    case 'Hard': return 50;
    default: return 0;
  }
};
