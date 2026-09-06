import React from 'react';
import { AVATARS } from '../utils/avatar';

export { AVATARS };

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
              className={`relative p-2.5 rounded-2xl border-2 border-slate-900 flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${av.bg || 'bg-amber-100'} ${
                isSelected
                  ? `ring-2 ring-amber-400 shadow-[0_4px_0_#0f172a] scale-105`
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
