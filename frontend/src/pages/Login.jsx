import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <div className="max-w-md mx-auto mt-12 p-8 rounded-xl shadow-lg bg-white border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">Student Login</h2>

      {flashMessage && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-3 mb-4 text-sm">
          {flashMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
            placeholder="student@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 pr-16 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 bg-slate-100 rounded"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
        <p className="text-xs text-slate-500">
          <Link to="/admin/login" className="hover:underline">
            Admin Portal Login &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
