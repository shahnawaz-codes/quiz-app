import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

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
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Guild Master privileges required!');
      }
    } else {
      setError(res.error || 'Invalid Guild Master credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 rounded-3xl shadow-[0_8px_0_#0f172a] bg-white border-4 border-slate-900 overflow-hidden">
      <div className="bg-slate-900 text-white p-6 text-center border-b-4 border-slate-900">
        <div className="inline-block p-3 bg-amber-400 border-2 border-white rounded-2xl mb-2 text-2xl font-black text-slate-900 shadow-[0_4px_0_#000]">
          👑 🛡️
        </div>
        <h2 className="text-2xl font-black tracking-wide text-yellow-300">GUILD MASTER GATE</h2>
        <p className="text-xs font-bold text-slate-300">Admin Control Center Authentication</p>
      </div>

      <div className="p-8 space-y-4">
        {error && (
          <div className="bg-coral-100 text-coral-800 border-2 border-coral-500 rounded-2xl p-4 text-sm font-bold shadow-[0_4px_0_#ef4444]">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-900 focus:outline-none focus:ring-4 focus:ring-sky-200 text-sm font-bold shadow-[0_4px_0_#0f172a]"
              placeholder="admin@guild.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
              Secret Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-16 rounded-2xl border-2 border-slate-900 focus:outline-none focus:ring-4 focus:ring-sky-200 text-sm font-bold shadow-[0_4px_0_#0f172a]"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-700 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-xl border border-slate-900"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black py-3.5 px-4 rounded-2xl border-2 border-slate-900 shadow-[0_6px_0_#0f172a] active:translate-y-1 active:shadow-[0_2px_0_#0f172a] transition-all disabled:opacity-50 text-base"
          >
            {loading ? 'UNLOCKING GATE...' : 'ENTER GUILD HALL 🗝️'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs font-extrabold text-sky-600 hover:underline">
            &larr; Return to Player Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
