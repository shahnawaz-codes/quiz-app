import React from 'react';
import { Trophy, Flame, Star, Crown } from 'lucide-react';
import { calculateLevel, getRankTitle } from '../../utils/formatters';

export default function LeaderboardWidget({ leaderboard = [], currentUserName }) {
  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-slate-900 shadow-[0_8px_0_#0f172a] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-900 font-black shadow-[0_3px_0_#0f172a]">
            <Trophy className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 font-cartoon">Hall of Champions</h3>
            <p className="text-slate-500 text-xs font-bold">Top Adventurers in Realm</p>
          </div>
        </div>
      </div>

      {/* Podium for Top 3 */}
      <div className="grid grid-cols-3 gap-3 pt-4 pb-2 items-end">
        {/* Rank 2 */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[0_3px_0_#0f172a]">
            {top3[1]?.avatar || '⚔️'}
          </div>
          <span className="text-[11px] font-black text-slate-900 font-cartoon truncate max-w-[80px] mt-1">
            {top3[1]?.name || 'Hero'}
          </span>
          <span className="text-[10px] font-extrabold text-sky-600 font-cartoon">
            {top3[1]?.points || 0} XP
          </span>
          <div className="w-full h-16 bg-slate-300 border-2 border-slate-900 rounded-t-2xl mt-2 flex items-center justify-center font-black font-cartoon text-slate-700">
            2nd 🥈
          </div>
        </div>

        {/* Rank 1 */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Crown className="w-6 h-6 text-amber-500 absolute -top-4 -left-1 animate-bounce" />
            <div className="w-14 h-14 rounded-2xl bg-amber-300 border-3 border-slate-900 flex items-center justify-center text-3xl shadow-[0_4px_0_#0f172a]">
              {top3[0]?.avatar || '👑'}
            </div>
          </div>
          <span className="text-xs font-black text-slate-900 font-cartoon truncate max-w-[90px] mt-1">
            {top3[0]?.name || 'Legend'}
          </span>
          <span className="text-[11px] font-extrabold text-amber-600 font-cartoon">
            {top3[0]?.points || 0} XP
          </span>
          <div className="w-full h-24 bg-amber-400 border-2 border-slate-900 rounded-t-2xl mt-2 flex items-center justify-center font-black font-cartoon text-slate-900 text-lg">
            1st 🏆
          </div>
        </div>

        {/* Rank 3 */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-700/20 border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[0_3px_0_#0f172a]">
            {top3[2]?.avatar || '🧙‍♂️'}
          </div>
          <span className="text-[11px] font-black text-slate-900 font-cartoon truncate max-w-[80px] mt-1">
            {top3[2]?.name || 'Mage'}
          </span>
          <span className="text-[10px] font-extrabold text-amber-700 font-cartoon">
            {top3[2]?.points || 0} XP
          </span>
          <div className="w-full h-12 bg-amber-200 border-2 border-slate-900 rounded-t-2xl mt-2 flex items-center justify-center font-black font-cartoon text-amber-900">
            3rd 🥉
          </div>
        </div>
      </div>

      {/* Remaining Leaderboard Table */}
      {remaining.length > 0 && (
        <div className="space-y-2 pt-2">
          {remaining.map((player) => {
            const isMe = currentUserName && player.name === currentUserName;
            const level = calculateLevel(player.points);
            return (
              <div
                key={player.id}
                className={`p-3 rounded-2xl border-2 border-slate-900 flex items-center justify-between shadow-[0_2px_0_#0f172a] ${
                  isMe ? 'bg-amber-100 ring-2 ring-amber-400' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 font-black font-cartoon text-slate-600 text-xs">
                    #{player.rank}
                  </span>
                  <span className="text-xl">{player.avatar}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 font-cartoon flex items-center gap-1">
                      {player.name}
                      {isMe && <span className="text-[9px] bg-amber-400 px-1.5 rounded-full border border-slate-900">YOU</span>}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500">
                      LVL {level} • {getRankTitle(level)}
                    </span>
                  </div>
                </div>
                <div className="text-right font-cartoon font-black text-sky-600 text-xs">
                  {player.points} XP
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
