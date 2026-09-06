export const AVATARS = [
  { id: 'yeti', emoji: '👹', name: 'Yeti Brawler', bg: 'bg-rose-500' },
  { id: 'koala', emoji: '🐨', name: 'Koala Ninja', bg: 'bg-emerald-500' },
  { id: 'cloud', emoji: '☁️', name: 'Nimbus Mage', bg: 'bg-sky-500' },
  { id: 'wizard', emoji: '🧙‍♂️', name: 'Grand Sorcerer', bg: 'bg-purple-500' },
  { id: 'shinobi', emoji: '🥷', name: 'Shadow Shinobi', bg: 'bg-amber-500' },
  { id: 'dragon', emoji: '🐲', name: 'Flame Dragon', bg: 'bg-orange-500' },
  { id: 'cyborg', emoji: '🤖', name: 'Cyber Titan', bg: 'bg-teal-500' },
  { id: 'fox', emoji: '🦊', name: 'Kitsune Ranger', bg: 'bg-pink-500' },
];

export const getUserAvatar = (avatarId) => {
  const selectedId = avatarId || (typeof window !== 'undefined' ? localStorage.getItem('quiz_app_avatar') : null) || 'yeti';
  return AVATARS.find(a => a.id === selectedId) || AVATARS[0];
};
