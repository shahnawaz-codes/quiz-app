import React from 'react';

export const AVATARS = [
  { id: 'yeti', emoji: '👹', name: 'Yeti King', bg: 'bg-amber-100 border-slate-900 text-amber-900', ring: 'border-yellow-400 bg-amber-200' },
  { id: 'koala', emoji: '🐨', name: 'Sky Koala', bg: 'bg-sky-100 border-slate-900 text-sky-900', ring: 'border-sky-400 bg-sky-200' },
  { id: 'cloud', emoji: '☁️', name: 'Nimbus', bg: 'bg-teal-100 border-slate-900 text-teal-900', ring: 'border-teal-400 bg-teal-200' },
  { id: 'wizard', emoji: '🧙‍♂️', name: 'Arcane Mage', bg: 'bg-blue-100 border-slate-900 text-blue-900', ring: 'border-blue-400 bg-blue-200' },
  { id: 'ninja', emoji: '🥷', name: 'Shadow Ninja', bg: 'bg-slate-200 border-slate-900 text-slate-900', ring: 'border-slate-500 bg-slate-300' },
  { id: 'dragon', emoji: '🐲', name: 'Flame Dragon', bg: 'bg-rose-100 border-slate-900 text-rose-900', ring: 'border-rose-400 bg-rose-200' },
  { id: 'robot', emoji: '🤖', name: 'Cyber Mech', bg: 'bg-emerald-100 border-slate-900 text-emerald-900', ring: 'border-emerald-400 bg-emerald-200' },
  { id: 'fox', emoji: '🦊', name: 'Kitsune Fox', bg: 'bg-orange-100 border-slate-900 text-orange-900', ring: 'border-orange-400 bg-orange-200' }
];

export default function AvatarSelector({ selectedAvatarId = 'yeti', onSelect }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-black uppercase tracking-wider text-slate-900 font-cartoon">
        Select Your Cartoon Avatar 🎮
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {AVATARS.map((av) => {
          const isSelected = selectedAvatarId === av.id;
          return (
            <button
              key={av.id}
              type="button"
              onClick={() => onSelect && onSelect(av.id)}
              className={`relative p-2.5 rounded-2xl border-2 border-slate-900 flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${av.bg} ${
                isSelected
                  ? `${av.ring} shadow-[0_4px_0_#0f172a] scale-105 ring-2 ring-yellow-400`
                  : 'opacity-80 hover:opacity-100 shadow-[0_2px_0_#0f172a]'
              }`}
              title={av.name}
            >
              <span className="text-2xl">{av.emoji}</span>
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[10px] font-black rounded-full border border-slate-900 flex items-center justify-center shadow">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

