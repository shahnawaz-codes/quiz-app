import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Sparkles, Trophy, ArrowRight, Zap, Star, ShieldCheck } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  // Redirect authenticated users directly to their active dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return (
    <div className="space-y-16 py-4 sm:py-8 pb-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-8 px-4 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-300 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-[0_3px_0_#0f172a] font-cartoon animate-bounce-subtle">
          <Sparkles className="w-4 h-4 text-slate-900" /> Cartoon Game Quiz Arena Season 4
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight font-cartoon drop-shadow-[0_3px_0_#38bdf8]">
          Master any topic, level up your rank &amp; conquer knowledge quests.
        </h1>

        <p className="text-sm sm:text-lg font-bold text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Step into the ultimate 3D cartoon quiz arena! Test your skills in real-time, climb the leaderboard podium, and earn S-Rank badges!
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <Link
            to="/register"
            className="btn-cartoon-yellow w-full sm:w-auto px-8 py-4 text-slate-900 rounded-2xl text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>JOIN REALM &amp; PLAY</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="btn-cartoon-sky w-full sm:w-auto px-8 py-4 text-white rounded-2xl text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Player Sign In
          </Link>
        </div>

        {/* Hero Illustrative 3D Cartoon Card Mockup */}
        <div className="pt-8">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border-4 border-slate-900 shadow-[0_10px_0_#0f172a] p-6 sm:p-8 text-left space-y-6 transform hover:-translate-y-1 transition duration-200 relative overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-2xl bg-amber-300 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-xs font-cartoon">
                  ⚡
                </span>
                <div>
                  <span className="text-xs font-black text-slate-900 block font-cartoon">Web Development Quest</span>
                  <span className="text-[10px] text-sky-600 font-bold">Stage 1 / 5</span>
                </div>
              </div>
              <span className="text-xs font-black bg-amber-300 text-slate-900 px-3 py-1 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a] font-cartoon flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" /> S-RANK
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 font-cartoon">Question 1</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-cartoon">What does PDO stand for in PHP web development?</h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl border-2 border-slate-900 text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-3 shadow-[0_3px_0_#0f172a]">
                <span className="w-6 h-6 rounded-lg bg-sky-100 border border-slate-900 text-slate-900 font-black text-xs flex items-center justify-center font-cartoon">A</span> PHP Data Output
              </div>
              <div className="p-3.5 rounded-2xl border-3 border-slate-900 bg-amber-300 text-xs sm:text-sm font-black text-slate-900 flex items-center justify-between shadow-[0_4px_0_#0f172a]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center font-cartoon">B</span> PHP Data Objects
                </div>
                <span className="text-slate-900 font-black text-xs font-cartoon">✓ CORRECT</span>
              </div>
              <div className="p-3.5 rounded-2xl border-2 border-slate-900 text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-3 shadow-[0_3px_0_#0f172a]">
                <span className="w-6 h-6 rounded-lg bg-sky-100 border border-slate-900 text-slate-900 font-black text-xs flex items-center justify-center font-cartoon">C</span> Process Database Optimization
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Features Section */}
      <section className="space-y-12 max-w-5xl mx-auto px-4 pt-4">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight font-cartoon">
            Built for Gamers, Students &amp; Guild Masters
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-500 max-w-xl mx-auto">
            Everything you need for interactive online testing in one gamified cartoon platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-8 border-3 border-slate-900 shadow-[0_6px_0_#0f172a] hover:shadow-[0_10px_0_#0f172a] transition space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 border-2 border-slate-900 text-sky-600 flex items-center justify-center text-2xl font-black shadow-sm">
              <Zap className="w-7 h-7 text-sky-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-cartoon">Instant XP &amp; Scoring</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
              Quiz attempts are evaluated securely in real-time with instant score calculations, EXP earnings, and rank badges.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-8 border-3 border-slate-900 shadow-[0_6px_0_#0f172a] hover:shadow-[0_10px_0_#0f172a] transition space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-slate-900 text-amber-600 flex items-center justify-center text-2xl font-black shadow-sm">
              <Trophy className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-cartoon">Leaderboard &amp; Quest Logs</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
              Players can inspect top champions on the global podium, review their battle history, and track completed quests.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl p-8 border-3 border-slate-900 shadow-[0_6px_0_#0f172a] hover:shadow-[0_10px_0_#0f172a] transition space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-slate-900 text-emerald-600 flex items-center justify-center text-2xl font-black shadow-sm">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-cartoon">Guild Master Console</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
              Instructors can build custom quiz stages, author option banks, and monitor student submission records.
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Cartoon Footer */}
      <footer className="pt-12 border-t-2 border-slate-200 text-center space-y-4 font-cartoon">
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-black text-slate-700">
          <Link to="/login" className="hover:text-sky-600 transition">Player Login</Link>
          <Link to="/register" className="hover:text-sky-600 transition">Guild Registration</Link>
          <Link to="/admin/login" className="hover:text-sky-600 transition">Guild Master Portal</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;


