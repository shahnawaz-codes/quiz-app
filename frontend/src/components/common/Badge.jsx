import React from 'react';

export default function Badge({ children, variant = 'sky', size = 'md' }) {
  const variants = {
    sky: 'bg-sky-500 text-white',
    amber: 'bg-amber-400 text-slate-900',
    emerald: 'bg-emerald-500 text-white',
    rose: 'bg-rose-500 text-white',
    slate: 'bg-slate-800 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-cartoon font-black rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a] uppercase tracking-wider ${variants[variant] || variants.sky} ${sizes[size]}`}>
      {children}
    </span>
  );
}
