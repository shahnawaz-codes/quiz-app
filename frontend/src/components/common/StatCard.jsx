import React from 'react';

export default function StatCard({ icon: Icon, title, value, colorBg = 'bg-sky-500', colorText = 'text-white', subtext }) {
  return (
    <div className={`rounded-3xl p-5 border-3 border-slate-900 shadow-[0_5px_0_#0f172a] ${colorBg} ${colorText} flex items-center justify-between transition-transform duration-200 hover:-translate-y-1`}>
      <div className="space-y-1">
        <span className="text-[11px] font-black uppercase tracking-wider block font-cartoon opacity-90">{title}</span>
        <span className="text-2xl sm:text-3xl font-black font-cartoon tracking-tight drop-shadow-sm">{value}</span>
        {subtext && <p className="text-[10px] font-bold opacity-80 mt-0.5">{subtext}</p>}
      </div>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-slate-900/30 flex items-center justify-center text-white shadow-inner">
          <Icon className="w-6 h-6 stroke-[2.5]" />
        </div>
      )}
    </div>
  );
}
