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
        setError('Access denied. You do not have admin privileges.');
      }
    } else {
      setError(res.error || 'Invalid admin credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 rounded-xl shadow-lg bg-white border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 text-white p-6 text-center">
        <h2 className="text-xl font-bold tracking-tight">Admin Portal Login</h2>
      </div>

      <div className="p-8">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
              placeholder="admin@example.com"
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
            {loading ? 'Logging in...' : 'Log In as Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs text-slate-500 hover:underline">
            &larr; Back to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
