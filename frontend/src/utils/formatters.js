/**
 * Centralized formatting and stat calculation utilities
 */

export const calculateExp = (userHistory = []) => {
  return userHistory.reduce((sum, h) => sum + (h.score || 0) * 100, 0);
};

export const calculateLevel = (exp = 0) => {
  return Math.max(1, Math.floor(exp / 500) + 1);
};

export const getRankTitle = (level = 1) => {
  if (level >= 10) return 'Grand Master 👑';
  if (level >= 7) return 'Elite Champion ⚔️';
  if (level >= 5) return 'Master Adventurer 🛡️';
  if (level >= 3) return 'Hero Knight 🗡️';
  return 'Rookie Questor 🔰';
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
};

export const getScoreGrade = (percentage) => {
  if (percentage >= 90) return { grade: 'S+', label: 'Godlike!', color: 'text-amber-500', bg: 'bg-amber-100' };
  if (percentage >= 75) return { grade: 'A', label: 'Legendary!', color: 'text-emerald-500', bg: 'bg-emerald-100' };
  if (percentage >= 50) return { grade: 'B', label: 'Passed!', color: 'text-sky-500', bg: 'bg-sky-100' };
  return { grade: 'F', label: 'Needs Training!', color: 'text-rose-500', bg: 'bg-rose-100' };
};
