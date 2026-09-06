import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trophy, Flame, Zap, Award, Sparkles, BookOpen, Star, ChevronRight, Play, Compass } from 'lucide-react';

const TOP_PLAYERS = [
  { rank: 1, name: 'Samuel', points: 2331, avatar: '👹', badge: '👑', color: 'bg-amber-300', border: 'border-slate-900' },
  { rank: 2, name: 'Christine', points: 1562, avatar: '🐨', badge: '🥈', color: 'bg-sky-300', border: 'border-slate-900' },
  { rank: 3, name: 'Nabilaw', points: 992, avatar: '☁️', badge: '🥉', color: 'bg-rose-300', border: 'border-slate-900' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError('');
      const res = await apiClient('/quizzes/list.php');
      if (res.success && res.data) {
        setQuizzes(res.data.quizzes || []);
      } else {
        setError(res.error || 'Failed to fetch quizzes.');
      }
      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Player Banner */}
      <div className="relative overflow-hidden bg-sky-600 rounded-3xl p-6 sm:p-8 text-white border-4 border-slate-900 shadow-[0_10px_0_#0f172a]">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Player Avatar Box */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-400 border-3 border-slate-900 text-3xl sm:text-4xl flex items-center justify-center shadow-[0_4px_0_#0f172a] transform hover:rotate-6 transition duration-300">
                👹
              </div>
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-slate-900 shadow font-cartoon">
                LVL 12
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-amber-400 text-slate-900 border-2 border-slate-900 rounded-full text-xs font-black uppercase shadow-[0_2px_0_#0f172a] font-cartoon">
                  <Sparkles className="w-3 h-3 text-slate-900" /> S-Rank Adventurer
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange-400 text-slate-900 border-2 border-slate-900 rounded-full text-xs font-black shadow-[0_2px_0_#0f172a] font-cartoon">
                  <Flame className="w-3 h-3 text-slate-900" /> 5 Day Streak
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-cartoon text-white drop-shadow-[0_3px_0_#0f172a]">
                Welcome Back, {user?.name}! ⚡
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm mt-1 max-w-xl font-bold">
                Ready to conquer new cartoon quests? Test your skills, climb the leaderboard podium, and earn XP points!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="bg-amber-300 text-slate-900 border-3 border-slate-900 px-4 py-2.5 rounded-2xl text-center flex-1 md:flex-initial shadow-[0_4px_0_#0f172a]">
              <span className="text-[10px] font-black uppercase tracking-wider block font-cartoon">TOTAL XP SCORE</span>
              <span className="text-xl font-black font-cartoon">4,235 PTS</span>
            </div>
            <Link
              to="/history"
              className="btn-cartoon-yellow px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <Trophy className="w-4 h-4 text-slate-900" />
              <span>Quest Log</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Leaderboard Top 3 Podium Card (Refined Cartoon 3D Style!) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[0_8px_0_#0f172a] space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-cartoon flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" /> Leaderboard Champions
            </h2>
            <p className="text-xs font-bold text-slate-500">Top scoring quiz masters this season</p>
          </div>
          <span className="text-xs font-black text-slate-900 bg-amber-300 px-3 py-1 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a] font-cartoon">
            Season 4 Arena
          </span>
        </div>

        {/* Podium Row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 max-w-2xl mx-auto items-end">
          {/* 2nd Place */}
          <div className="flex flex-col items-center p-3 sm:p-4 rounded-3xl bg-sky-100 border-3 border-slate-900 shadow-[0_5px_0_#0f172a] text-center transform hover:-translate-y-1 transition duration-200">
            <div className="relative mb-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-sky-400 border-3 border-slate-900 text-2xl sm:text-3xl flex items-center justify-center shadow-md">
                {TOP_PLAYERS[1].avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-sky-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow font-cartoon">
                2
              </span>
            </div>
            <span className="font-black text-xs sm:text-sm text-slate-900 truncate max-w-full font-cartoon">{TOP_PLAYERS[1].name}</span>
            <span className="text-[11px] font-black text-sky-800 font-cartoon bg-white px-2 py-0.5 rounded-full mt-1 border border-slate-900">{TOP_PLAYERS[1].points} pts</span>
          </div>

          {/* 1st Place (Center Gold Podium) */}
          <div className="flex flex-col items-center p-4 sm:p-5 rounded-3xl bg-amber-200 border-4 border-slate-900 text-center shadow-[0_8px_0_#0f172a] transform -translate-y-2 hover:-translate-y-3 transition duration-200 relative">
            <span className="text-2xl mb-1 animate-bounce-subtle">👑</span>
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 border-4 border-slate-900 text-3xl sm:text-4xl flex items-center justify-center shadow-md">
                {TOP_PLAYERS[0].avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-900 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 shadow font-cartoon">
                1
              </span>
            </div>
            <span className="font-black text-sm sm:text-base text-slate-900 truncate max-w-full font-cartoon">{TOP_PLAYERS[0].name}</span>
            <span className="text-xs font-black text-slate-900 font-cartoon bg-white px-3 py-0.5 rounded-full mt-1 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
              {TOP_PLAYERS[0].points} pts
            </span>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center p-3 sm:p-4 rounded-3xl bg-rose-100 border-3 border-slate-900 shadow-[0_5px_0_#0f172a] text-center transform hover:-translate-y-1 transition duration-200">
            <div className="relative mb-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-rose-400 border-3 border-slate-900 text-2xl sm:text-3xl flex items-center justify-center shadow-md">
                {TOP_PLAYERS[2].avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-rose-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow font-cartoon">
                3
              </span>
            </div>
            <span className="font-black text-xs sm:text-sm text-slate-900 truncate max-w-full font-cartoon">{TOP_PLAYERS[2].name}</span>
            <span className="text-[11px] font-black text-rose-800 font-cartoon bg-white px-2 py-0.5 rounded-full mt-1 border border-slate-900">{TOP_PLAYERS[2].points} pts</span>
          </div>
        </div>
      </div>

      {/* Available Quizzes Header & Category Pills */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-cartoon flex items-center gap-2">
              <Compass className="w-6 h-6 text-sky-600" /> Active Quests
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-500">Pick a module below to enter battle</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {['All', 'Science', 'Math', 'Tech', 'Music', 'Arts'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all font-cartoon border-2 border-slate-900 ${
                  activeCategory === cat
                    ? 'bg-sky-500 text-white shadow-[0_3px_0_#0f172a]'
                    : 'bg-white text-slate-900 hover:bg-sky-100 shadow-[0_2px_0_#0f172a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-rose-100 text-rose-900 border-3 border-slate-900 rounded-2xl p-4 text-sm font-black shadow-[0_4px_0_#0f172a] flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Quizzes Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-3xl border-4 border-slate-900 p-12 text-center shadow-[0_8px_0_#0f172a] space-y-4">
            <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl shadow-sm">
              🔮
            </div>
            <h3 className="text-xl font-black text-slate-900 font-cartoon">No Quests Available Yet</h3>
            <p className="text-slate-600 text-xs sm:text-sm font-bold max-w-md mx-auto">
              The Guild Master has not posted any new quizzes yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, idx) => {
              const cardThemes = [
                { headerBg: 'bg-sky-500 text-white', badge: 'bg-sky-100 text-sky-900', icon: '⚡' },
                { headerBg: 'bg-rose-500 text-white', badge: 'bg-rose-100 text-rose-900', icon: '🎨' },
                { headerBg: 'bg-emerald-500 text-white', badge: 'bg-emerald-100 text-emerald-900', icon: '🧪' },
                { headerBg: 'bg-amber-400 text-slate-900', badge: 'bg-amber-100 text-amber-900', icon: '📐' }
              ];
              const theme = cardThemes[idx % cardThemes.length];

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-3xl border-3 border-slate-900 shadow-[0_6px_0_#0f172a] hover:shadow-[0_10px_0_#0f172a] transition-all duration-200 p-6 flex flex-col justify-between group transform hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`px-3 py-1 rounded-2xl text-xs font-black uppercase border-2 border-slate-900 flex items-center gap-1 font-cartoon ${theme.badge}`}>
                        <span>{theme.icon}</span> Quest #{quiz.id}
                      </span>
                      <span className="text-xs font-black text-slate-900 bg-amber-300 px-2.5 py-1 rounded-full border-2 border-slate-900 font-cartoon flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" /> +250 XP
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 font-cartoon leading-tight group-hover:text-sky-600 transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {quiz.description || 'Embark on this cartoon knowledge quest to test your proficiency and earn leaderboard points!'}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-black text-slate-900 border-t-2 border-slate-100 font-cartoon">
                      <span className="flex items-center gap-1 text-sky-700">
                        <BookOpen className="w-4 h-4 text-sky-600" /> {quiz.question_count} Questions
                      </span>
                      <span className="text-slate-900 bg-sky-100 px-2.5 py-0.5 rounded-full text-[11px] border border-slate-900">
                        Standard Time
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-2">
                    {quiz.question_count > 0 ? (
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="btn-cartoon-sky w-full py-3 px-4 rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>START QUEST</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full text-center bg-slate-100 text-slate-400 font-black py-3 px-4 rounded-2xl text-xs cursor-not-allowed border-2 border-slate-300"
                      >
                        Quest Locked
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


