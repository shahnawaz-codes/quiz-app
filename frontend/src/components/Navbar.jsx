import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => `
    text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5
    ${isActive(path) 
      ? 'text-white bg-indigo-600/20 border border-indigo-500/30 shadow-sm' 
      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
    }
  `;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-slate-950/20 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap justify-between items-center gap-4">
        {/* Brand Logo */}
        <Link
          to={user ? (role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'}
          className="flex items-center gap-3 group transition"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/30 group-hover:scale-105 group-hover:shadow-indigo-500/50 transition-all duration-300">
            ⚡
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            Online Quiz Platform
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {user ? (
            <>
              {role === 'admin' ? (
                <>
                  <Link to="/admin/dashboard" className={linkStyle('/admin/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/admin/quizzes" className={linkStyle('/admin/quizzes')}>
                    Manage Quizzes
                  </Link>
                  <Link to="/admin/results" className={linkStyle('/admin/results')}>
                    Student Results
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={linkStyle('/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/history" className={linkStyle('/history')}>
                    History
                  </Link>
                </>
              )}

              {/* User Role Badge */}
              <div className="hidden sm:flex items-center text-xs bg-slate-800/90 border border-slate-700/80 text-slate-300 px-3 py-1.5 rounded-full font-medium shadow-inner ml-2">
                <span>{user.name}</span>
                {role === 'admin' && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
                    ADMIN
                  </span>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-sm bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive('/login')
                    ? 'text-white bg-slate-800 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold shadow-md shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
