import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Lock, Mail, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  const flashMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      return setError('Please enter both email and password.');
    }

    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.data) {
      const target = res.data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(target);
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8 rounded-3xl shadow-[0_8px_0_#0f172a] bg-white border-4 border-slate-900 relative overflow-hidden">
      <div className="text-center space-y-2 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-400 border-3 border-slate-900 text-slate-900 flex items-center justify-center mx-auto shadow-[0_4px_0_#0f172a]">
          <Gamepad2 className="w-8 h-8 text-slate-900" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-cartoon">Player Sign In</h2>
        <p className="text-xs font-bold text-slate-500">Welcome back, Adventurer! Enter your credentials to play</p>
      </div>

      {flashMessage && (
        <div className="bg-emerald-100 text-emerald-900 border-2 border-slate-900 rounded-2xl p-3.5 mb-4 text-xs font-black flex items-center gap-2 font-cartoon shadow-[0_2px_0_#0f172a]">
          <span>✨</span> {flashMessage}
        </div>
      )}

      {error && (
        <div className="bg-rose-100 text-rose-900 border-2 border-slate-900 rounded-2xl p-3.5 mb-4 text-xs font-black flex items-center gap-2 font-cartoon shadow-[0_2px_0_#0f172a]">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 font-cartoon">
            Player Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-900 focus:ring-2 focus:ring-sky-500 transition text-sm font-bold text-slate-900 bg-sky-50"
              placeholder="player@quizrealm.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 font-cartoon">
            Secret Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-16 py-3 rounded-2xl border-2 border-slate-900 focus:ring-2 focus:ring-sky-500 transition text-sm font-bold text-slate-900 bg-sky-50"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-900 px-2 py-1 bg-amber-300 border border-slate-900 rounded-xl transition font-cartoon"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-cartoon-sky w-full mt-6 py-3.5 px-4 rounded-2xl text-sm uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Authenticating...' : 'Enter Realm'}</span>
        </button>
      </form>

      <div className="mt-6 text-center space-y-2.5 pt-4 border-t-2 border-slate-100">
        <p className="text-xs text-slate-900 font-bold">
          New to Quiz Arena?{' '}
          <Link to="/register" className="text-sky-600 font-black hover:underline font-cartoon">
            Register your Account
          </Link>
        </p>
        <p className="text-xs text-slate-500 font-bold">
          <Link to="/admin/login" className="hover:underline flex items-center justify-center gap-1 font-cartoon">
            <Sparkles className="w-3 h-3 text-amber-500" /> Admin Master Portal &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


