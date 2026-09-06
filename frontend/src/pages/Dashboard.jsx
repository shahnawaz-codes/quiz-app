import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../services/quizService';
import { resultService } from '../services/resultService';
import LoadingSpinner from '../components/LoadingSpinner';
import QuizCard from '../components/quiz/QuizCard';
import LeaderboardWidget from '../components/quiz/LeaderboardWidget';
import StatCard from '../components/common/StatCard';
import { getUserAvatar } from '../utils/avatar';
import { calculateExp, calculateLevel, getRankTitle } from '../utils/formatters';
import { Trophy, Flame, Sparkles, Compass, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const userAvatar = getUserAvatar();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      const [quizRes, leaderRes, historyRes] = await Promise.all([
        quizService.getQuizzes(),
        resultService.getLeaderboard(),
        resultService.getUserHistory()
      ]);

      if (quizRes.success && quizRes.data) {
        setQuizzes(quizRes.data.quizzes || []);
      } else {
        setError(quizRes.error || 'Failed to fetch quizzes.');
      }

      if (leaderRes.success && leaderRes.data) {
        setLeaderboard(leaderRes.data.leaderboard || []);
      }

      if (historyRes.success && historyRes.data) {
        setUserHistory(historyRes.data.results || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const totalExp = calculateExp(userHistory);
  const userLevel = calculateLevel(totalExp);
  const userRankTitle = getRankTitle(userLevel);
  const completedQuizIds = new Set(userHistory.map(h => h.quiz_id));

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-sky-600 rounded-3xl p-6 sm:p-8 text-white border-4 border-slate-900 shadow-[0_10px_0_#0f172a]">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${userAvatar.bg} border-3 border-slate-900 text-3xl sm:text-4xl flex items-center justify-center shadow-[0_4px_0_#0f172a] transform hover:rotate-6 transition duration-300`}>
                {userAvatar.emoji}
              </div>
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-slate-900 shadow font-cartoon">
                LVL {userLevel}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-amber-400 text-slate-900 border-2 border-slate-900 rounded-full text-xs font-black uppercase shadow-[0_2px_0_#0f172a] font-cartoon">
                  <Sparkles className="w-3 h-3 text-slate-900" /> {userRankTitle}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange-400 text-slate-900 border-2 border-slate-900 rounded-full text-xs font-black shadow-[0_2px_0_#0f172a] font-cartoon">
                  <Flame className="w-3 h-3 text-slate-900" /> {userHistory.length} Quests Cleared
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
              <span className="text-xl font-black font-cartoon">{totalExp} PTS</span>
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

      {/* Main Grid: Quests & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Quests (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-cartoon flex items-center gap-2">
                <Compass className="w-6 h-6 text-sky-600" /> Active Quests
              </h2>
              <p className="text-xs font-bold text-slate-500">Pick a module below to enter battle</p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {['All', 'Science', 'Tech', 'Trivia'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1 rounded-full text-xs font-black transition-all font-cartoon border-2 border-slate-900 ${
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
            <div className="bg-rose-100 text-rose-900 border-3 border-slate-900 rounded-2xl p-4 text-sm font-black shadow-[0_4px_0_#0f172a]">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : quizzes.length === 0 ? (
            <div className="bg-white rounded-3xl border-4 border-slate-900 p-12 text-center shadow-[0_8px_0_#0f172a] space-y-4">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl">
                🔮
              </div>
              <h3 className="text-xl font-black text-slate-900 font-cartoon">No Quests Available Yet</h3>
              <p className="text-slate-600 text-xs sm:text-sm font-bold max-w-md mx-auto">
                The Guild Master has not posted any new quizzes yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  hasCompleted={completedQuizIds.has(quiz.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Leaderboard Widget (1 Col) */}
        <div className="space-y-6">
          <LeaderboardWidget leaderboard={leaderboard} currentUserName={user?.name} />

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Flame}
              title="QUESTS CLEARED"
              value={userHistory.length}
              colorBg="bg-amber-400"
              colorText="text-slate-900"
            />
            <StatCard
              icon={ShieldCheck}
              title="CURRENT LEVEL"
              value={`LVL ${userLevel}`}
              colorBg="bg-emerald-500"
              colorText="text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
