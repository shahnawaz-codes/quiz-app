import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import AvatarSelector, { AVATARS } from '../components/AvatarSelector';
import { Trophy, Flame, Shield, Award, Zap, History, User, CheckCircle, Crosshair, Sparkles, Star } from 'lucide-react';

const Profile = () => {
  const { user, role } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Avatar state stored in local/sessionStorage
  const [avatarId, setAvatarId] = useState(() => {
    return localStorage.getItem('quiz_app_avatar') || 'yeti';
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      const res = await apiClient('/results/history.php');
      if (res.success && res.data) {
        setHistory(res.data.results || []);
      } else {
        setError(res.error || 'Failed to load quest history.');
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const handleAvatarSelect = (id) => {
    setAvatarId(id);
    localStorage.setItem('quiz_app_avatar', id);
  };

  const activeAvatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

  // Calculated Stats
  const totalAttempts = history.length;
  const victories = history.filter(h => h.passed).length;
  const totalScore = history.reduce((sum, h) => sum + h.score, 0);
  const totalQuestions = history.reduce((sum, h) => sum + h.total_questions, 0);
  const expEarned = totalScore * 100;
  const averageAccuracy = totalAttempts > 0
    ? (history.reduce((sum, h) => sum + h.percentage, 0) / totalAttempts).toFixed(1)
    : '0.0';
  const highestScore = totalAttempts > 0
    ? Math.max(...history.map(h => h.percentage))
    : 0;

  // Level Calculation (Every 500 EXP = 1 Level)
  const currentLevel = Math.max(1, Math.floor(expEarned / 500) + 1);
  const currentLevelExp = expEarned % 500;
  const levelProgress = Math.min(100, Math.round((currentLevelExp / 500) * 100));

  // Achievements Definition
  const achievements = [
    {
      id: 'first_blood',
      title: 'First Quest 🗡️',
      desc: 'Complete your 1st quiz quest',
      unlocked: totalAttempts >= 1,
      icon: '🗡️',
      color: 'bg-amber-100 border-amber-500 text-amber-900'
    },
    {
      id: 'victory_vanguard',
      title: 'Victory Vanguard 🌟',
      desc: 'Clear and pass at least 1 quest',
      unlocked: victories >= 1,
      icon: '🌟',
      color: 'bg-emerald-100 border-emerald-500 text-emerald-900'
    },
    {
      id: 'sharpshooter',
      title: 'Sharpshooter 🎯',
      desc: 'Achieve 100% accuracy on any quest',
      unlocked: highestScore === 100,
      icon: '🎯',
      color: 'bg-sky-100 border-sky-500 text-sky-900'
    },
    {
      id: 'exp_titan',
      title: 'EXP Titan 🔥',
      desc: 'Accumulate 1,000+ total EXP',
      unlocked: expEarned >= 1000,
      icon: '🔥',
      color: 'bg-rose-100 border-rose-500 text-rose-900'
    },
    {
      id: 'quest_master',
      title: 'Quest Master 👑',
      desc: 'Clear 5 or more quests in victory',
      unlocked: victories >= 5,
      icon: '👑',
      color: 'bg-yellow-100 border-yellow-500 text-yellow-900'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-8 font-cartoon pb-12">
      {/* Top Banner Player Card */}
      <div className="relative bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_#0f172a] p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Display & Change Button */}
          <div className="flex flex-col items-center gap-2">
            <div className={`relative w-28 h-28 rounded-3xl border-4 border-slate-900 ${activeAvatar.bg} flex items-center justify-center text-6xl shadow-[0_6px_0_#0f172a] transform hover:rotate-3 transition duration-200`}>
              {activeAvatar.emoji}
              <div className="absolute -bottom-2 -right-2 bg-amber-400 border-2 border-slate-900 text-slate-900 text-xs font-black px-2 py-0.5 rounded-xl shadow">
                LVL {currentLevel}
              </div>
            </div>
            <button
              onClick={() => setShowAvatarModal(!showAvatarModal)}
              className="text-xs font-black text-sky-600 hover:text-sky-700 underline tracking-wide mt-1"
            >
              {showAvatarModal ? 'Close Customizer ✖' : 'Change Avatar 🎨'}
            </button>
          </div>

          {/* Player Info & EXP Bar */}
          <div className="flex-1 text-center md:text-left space-y-3 w-full">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-wide">
                {user?.name || 'Hero Player'}
              </h1>
              <span className={`px-3 py-1 rounded-2xl text-xs font-black border-2 border-slate-900 shadow-[0_2px_0_#0f172a] uppercase tracking-wider ${
                role === 'admin' ? 'bg-amber-400 text-slate-900' : 'bg-sky-400 text-white'
              }`}>
                {role === 'admin' ? '👑 GUILD MASTER' : '⚔️ ADVENTURER'}
              </span>
            </div>

            <p className="text-sm font-bold text-slate-500">
              {user?.email || 'player@realm.com'} • Title: <span className="text-amber-600 font-black">{activeAvatar.name}</span>
            </p>

            {/* EXP Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs font-black text-slate-700">
                <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-amber-500" /> EXP Progress</span>
                <span className="text-amber-600 font-extrabold">{currentLevelExp} / 500 EXP ({levelProgress}%)</span>
              </div>
              <div className="w-full bg-slate-200 h-5 rounded-2xl border-2 border-slate-900 p-0.5 shadow-inner overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-xl border border-slate-900 transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Customizer Drawer inside Profile */}
        {showAvatarModal && (
          <div className="mt-6 pt-6 border-t-4 border-slate-900 bg-sky-50 rounded-2xl p-4 border-2 border-slate-900">
            <AvatarSelector selectedAvatarId={avatarId} onSelect={handleAvatarSelect} />
          </div>
        )}
      </div>

      {/* Stats Cards Showcase Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-sky-100 rounded-3xl p-5 border-4 border-slate-900 shadow-[0_6px_0_#0f172a] text-center transform hover:-translate-y-1 transition">
          <div className="w-12 h-12 bg-sky-400 border-2 border-slate-900 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2 shadow-[0_3px_0_#0f172a]">
            ⚔️
          </div>
          <span className="text-xs font-black uppercase text-slate-600 tracking-wider">Quests Attempted</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalAttempts}</p>
        </div>

        <div className="bg-emerald-100 rounded-3xl p-5 border-4 border-slate-900 shadow-[0_6px_0_#0f172a] text-center transform hover:-translate-y-1 transition">
          <div className="w-12 h-12 bg-emerald-400 border-2 border-slate-900 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2 shadow-[0_3px_0_#0f172a]">
            🌟
          </div>
          <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">Victories Cleared</span>
          <p className="text-3xl font-black text-emerald-800 mt-1">{victories}</p>
        </div>

        <div className="bg-amber-100 rounded-3xl p-5 border-4 border-slate-900 shadow-[0_6px_0_#0f172a] text-center transform hover:-translate-y-1 transition">
          <div className="w-12 h-12 bg-amber-400 border-2 border-slate-900 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2 shadow-[0_3px_0_#0f172a]">
            🔥
          </div>
          <span className="text-xs font-black uppercase text-amber-800 tracking-wider">Total EXP Earned</span>
          <p className="text-3xl font-black text-amber-800 mt-1">{expEarned}</p>
        </div>

        <div className="bg-rose-100 rounded-3xl p-5 border-4 border-slate-900 shadow-[0_6px_0_#0f172a] text-center transform hover:-translate-y-1 transition">
          <div className="w-12 h-12 bg-rose-400 border-2 border-slate-900 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2 shadow-[0_3px_0_#0f172a]">
            🎯
          </div>
          <span className="text-xs font-black uppercase text-rose-800 tracking-wider">Avg Accuracy</span>
          <p className="text-3xl font-black text-rose-800 mt-1">{averageAccuracy}%</p>
        </div>
      </div>

      {/* Achievements & Trophies Showcase */}
      <div className="bg-white rounded-3xl border-4 border-slate-900 p-6 sm:p-8 shadow-[0_8px_0_#0f172a] space-y-6">
        <div className="flex justify-between items-center border-b-4 border-slate-900 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide flex items-center gap-2">
              🏆 TROPHY CABINET & BADGES
            </h2>
            <p className="text-xs font-bold text-slate-500">Unlock gaming badges as you clear quests</p>
          </div>
          <div className="bg-amber-100 border-2 border-slate-900 px-4 py-2 rounded-2xl text-xs font-black text-slate-900 shadow-[0_3px_0_#0f172a]">
            UNLOCKED: <span className="text-amber-600 text-sm font-black">{unlockedCount} / {achievements.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border-4 border-slate-900 transition-all ${
                ach.unlocked
                  ? `${ach.color} shadow-[0_4px_0_#0f172a]`
                  : 'bg-slate-100 border-slate-400 text-slate-400 opacity-60 shadow-none'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-3xl p-2 rounded-xl border-2 border-slate-900 ${ach.unlocked ? 'bg-white shadow-[0_2px_0_#0f172a]' : 'bg-slate-200'}`}>
                  {ach.icon}
                </span>
                <div>
                  <h4 className="font-black text-base leading-tight text-slate-900">{ach.title}</h4>
                  <p className="text-xs font-bold mt-0.5">{ach.desc}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-lg text-[10px] font-black border border-slate-900 ${
                    ach.unlocked ? 'bg-emerald-400 text-slate-900' : 'bg-slate-300 text-slate-600'
                  }`}>
                    {ach.unlocked ? 'UNLOCKED ★' : 'LOCKED 🔒'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quest Battle Log (History) */}
      <div className="bg-white rounded-3xl border-4 border-slate-900 p-6 sm:p-8 shadow-[0_8px_0_#0f172a] space-y-6">
        <div className="flex justify-between items-center border-b-4 border-slate-900 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide flex items-center gap-2">
              📜 QUEST BATTLE LOG
            </h2>
            <p className="text-xs font-bold text-slate-500">Your recent attempt records & battle stats</p>
          </div>
          <Link
            to="/history"
            className="btn-cartoon-sky text-xs px-4 py-2 rounded-2xl font-black flex items-center gap-1"
          >
            Full Log &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-coral-100 text-coral-800 border-2 border-coral-500 rounded-2xl p-4 text-sm font-bold shadow-[0_4px_0_#ef4444]">
            ⚠️ {error}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 bg-sky-100 border-2 border-slate-900 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-[0_4px_0_#0f172a]">
              🗺️
            </div>
            <p className="text-slate-900 font-black text-lg">No Quests Attempted Yet!</p>
            <Link
              to="/dashboard"
              className="inline-block btn-cartoon-yellow px-6 py-2.5 rounded-2xl text-sm font-black"
            >
              Start Your First Quest ⚔️
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-4 divide-slate-900">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-amber-300">Quest Title</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Accuracy</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-300">Completed</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 bg-white font-bold text-sm">
                {history.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-sky-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-black text-slate-900">
                      {r.quiz_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-base font-black text-slate-900">
                      {r.score} / {r.total_questions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 shadow-[0_2px_0_#0f172a] ${
                        r.passed ? 'bg-emerald-400 text-slate-900' : 'bg-coral-400 text-white'
                      }`}>
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 shadow-[0_2px_0_#0f172a] ${
                        r.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-coral-100 text-coral-800'
                      }`}>
                        {r.passed ? 'CLEARED 🌟' : 'FAILED 💔'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-slate-500 font-bold">
                      {new Date(r.completed_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        to={`/result/${r.id}`}
                        className="inline-flex items-center px-3 py-1.5 border-2 border-slate-900 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-black shadow-[0_2px_0_#0f172a] transition"
                      >
                        View Victory Card 🏆
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
