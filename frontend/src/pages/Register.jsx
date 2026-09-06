import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AvatarSelector from '../components/AvatarSelector';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('yeti');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Full name is required.');
    if (!email.trim()) return setError('Email address is required.');
    if (!password) return setError('Password is required.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setLoading(true);

    const res = await register(name, email, password, confirmPassword);
    setLoading(false);

    if (res.success) {
      navigate('/login', { state: { message: 'Registration successful! Enter your credentials to log in.' } });
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8 rounded-3xl shadow-[0_8px_0_#0f172a] bg-white border-4 border-slate-900 relative overflow-hidden">
      <div className="text-center space-y-2 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-400 border-3 border-slate-900 text-slate-900 flex items-center justify-center mx-auto shadow-[0_4px_0_#0f172a]">
          <UserPlus className="w-8 h-8 text-slate-900" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-cartoon">Join the Realm</h2>
        <p className="text-xs font-bold text-slate-500">Create your adventurer profile to begin taking quizzes</p>
      </div>

      {error && (
        <div className="bg-rose-100 text-rose-900 border-2 border-slate-900 rounded-2xl p-3.5 mb-4 text-xs font-black flex items-center gap-2 font-cartoon shadow-[0_2px_0_#0f172a]">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Selection Box */}
        <AvatarSelector selectedAvatarId={selectedAvatar} onSelect={setSelectedAvatar} />

        <div>
          <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 font-cartoon flex justify-between">
            <span>Unique Adventurer Alias / Gamer Tag 🎮</span>
            <span className="text-[10px] text-amber-600 font-bold">Must be Unique</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-900 focus:ring-2 focus:ring-sky-500 transition text-sm font-bold text-slate-900 bg-sky-50"
              placeholder="e.g. ShadowKnight99"
              required
            />
          </div>
          <p className="text-[11px] font-bold text-slate-500 mt-1">
            This name will be your unique gamer tag on the Live Leaderboard.
          </p>
        </div>

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
              placeholder="jane@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 font-cartoon">
            Password (Min 6 Characters)
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

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 font-cartoon">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-16 py-3 rounded-2xl border-2 border-slate-900 focus:ring-2 focus:ring-sky-500 transition text-sm font-bold text-slate-900 bg-sky-50"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-900 px-2 py-1 bg-amber-300 border border-slate-900 rounded-xl transition font-cartoon"
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-cartoon-yellow w-full mt-6 text-slate-900 py-3.5 px-4 rounded-2xl text-sm uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-slate-900" />
          <span>{loading ? 'Creating Profile...' : 'Complete Profile Setup'}</span>
        </button>
      </form>

      <div className="mt-6 text-center pt-4 border-t-2 border-slate-100 font-cartoon">
        <p className="text-xs text-slate-900 font-bold">
          Already registered?{' '}
          <Link to="/login" className="text-sky-600 font-black hover:underline">
            Login to your profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;


