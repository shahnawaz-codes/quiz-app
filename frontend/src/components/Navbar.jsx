import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Flame, Trophy, LogOut, ShieldCheck, Sparkles, Volume2, VolumeX, History, LayoutDashboard, User, Music } from 'lucide-react';
import { startChuninExamTheme, stopChuninExamTheme, playButtonSound } from '../utils/audio';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleLogout = () => {
    stopChuninExamTheme();
    logout();
    navigate('/login');
  };

  const toggleSound = () => {
    playButtonSound();
    if (!soundEnabled) {
      startChuninExamTheme();
      setSoundEnabled(true);
    } else {
      stopChuninExamTheme();
      setSoundEnabled(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => `
    text-xs sm:text-sm font-extrabold px-4 py-2 rounded-2xl transition-all duration-150 flex items-center gap-2 tracking-wide font-cartoon border-2 border-slate-900
    ${isActive(path) 
      ? 'text-white bg-sky-600 shadow-[0_4px_0_#0f172a] scale-105' 
      : 'text-slate-900 bg-white hover:bg-sky-100 shadow-[0_2px_0_#0f172a] hover:translate-y-[-1px]'
    }
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-slate-900 shadow-md transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* Cartoon Brand Logo */}
        <Link
          to={user ? (role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'}
          className="flex items-center gap-3 group transition"
          onClick={playButtonSound}
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-400 border-3 border-slate-900 text-slate-900 flex items-center justify-center font-black shadow-[0_4px_0_#0f172a] group-hover:rotate-6 transition-all duration-300">
            <Gamepad2 className="w-6 h-6 text-slate-900 animate-bounce-subtle" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-slate-900 font-cartoon uppercase">
              QUIZ ARENA ⚡
            </span>
            <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase -mt-1 flex items-center gap-1 font-cartoon">
              <Sparkles className="w-3 h-3 text-amber-500" /> Cartoon Game Quest
            </span>
          </div>
        </Link>

        {/* Navigation Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Naruto Chunin Exam Theme Sound Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              title={soundEnabled ? "Naruto Chunin Exam Theme ON 🍃" : "Sound OFF (Click to Play Naruto Chunin Exam Theme 🍃)"}
              className={`p-2.5 rounded-2xl border-2 border-slate-900 text-slate-900 shadow-[0_3px_0_#0f172a] active:translate-y-0.5 transition-all flex items-center gap-1.5 font-cartoon ${
                soundEnabled ? 'bg-amber-300 ring-2 ring-amber-400 animate-pulse' : 'bg-sky-100 hover:bg-sky-200'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-slate-900" />
                  <span className="text-xs font-black text-slate-900 hidden sm:inline">🍃 Chunin Theme ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-black text-slate-600 hidden sm:inline">Play Theme 🍃</span>
                </>
              )}
            </button>
          </div>

          {user ? (
            <>
              {role === 'admin' ? (
                <>
                  <Link to="/admin/dashboard" className={linkStyle('/admin/dashboard')}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/admin/quizzes" className={linkStyle('/admin/quizzes')}>
                    <Trophy className="w-4 h-4" />
                    <span>Quizzes</span>
                  </Link>
                  <Link to="/admin/results" className={linkStyle('/admin/results')}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Results</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={linkStyle('/dashboard')}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Quests</span>
                  </Link>
                  <Link to="/history" className={linkStyle('/history')}>
                    <History className="w-4 h-4" />
                    <span>Quest Log</span>
                  </Link>
                  <Link to="/profile" className={linkStyle('/profile')}>
                    <User className="w-4 h-4" />
                    <span>Hero Card</span>
                  </Link>
                </>
              )}

              {/* Clickable Player Status Badge */}
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 bg-amber-100 border-2 border-slate-900 text-slate-900 px-3 py-1.5 rounded-2xl font-black text-xs shadow-[0_3px_0_#0f172a] font-cartoon hover:scale-105 hover:bg-amber-200 transition-all"
                title="View Hero Profile"
              >
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 border border-slate-900 flex items-center justify-center font-black text-xs shadow-sm">
                  👑
                </span>
                <span>{user.name}</span>
                {role === 'admin' ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[9px] border border-slate-900 shadow-sm uppercase tracking-wider">
                    GUILD MASTER
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-sky-600 text-white font-black text-[9px] border border-slate-900 shadow-sm uppercase tracking-wider flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-amber-300 inline" /> HERO
                  </span>
                )}
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn-cartoon-red text-xs sm:text-sm px-3.5 py-2 rounded-2xl font-black flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-xs sm:text-sm font-extrabold px-4 py-2 rounded-2xl transition-all duration-150 font-cartoon border-2 border-slate-900 ${
                  isActive('/login')
                    ? 'text-slate-900 bg-sky-200 shadow-[0_3px_0_#0f172a]'
                    : 'text-slate-800 bg-white hover:bg-slate-100 shadow-[0_3px_0_#0f172a]'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-cartoon-yellow text-xs sm:text-sm px-5 py-2 rounded-2xl font-black uppercase tracking-wide"
              >
                Join Realm ✨
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


