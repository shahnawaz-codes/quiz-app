import React from 'react';

export default function PageHeader({ icon: Icon, title, subtitle, badgeText, children }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[0_8px_0_#0f172a] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-14 h-14 rounded-2xl bg-amber-400 border-3 border-slate-900 text-slate-900 flex items-center justify-center text-2xl font-black shadow-[0_4px_0_#0f172a] shrink-0">
            <Icon className="w-7 h-7 stroke-[2.5]" />
          </div>
        )}
        <div>
          {badgeText && (
            <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-sky-100 text-sky-900 border-2 border-slate-900 rounded-full text-[10px] font-black uppercase tracking-wider font-cartoon mb-1 shadow-[0_2px_0_#0f172a]">
              {badgeText}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-cartoon">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-600 text-xs sm:text-sm font-bold mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-3 w-full md:w-auto">{children}</div>}
    </div>
  );
}
