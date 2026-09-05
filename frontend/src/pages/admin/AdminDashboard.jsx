import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    quizCount: 0,
    totalAttempts: 0,
    passRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const [quizRes, resultsRes] = await Promise.all([
        apiClient('/quizzes/list.php'),
        apiClient('/results/admin-list.php')
      ]);

      let quizCount = 0;
      let totalAttempts = 0;
      let passRate = 0;

      if (quizRes.success && quizRes.data) {
        quizCount = quizRes.data.quizzes ? quizRes.data.quizzes.length : 0;
      }

      if (resultsRes.success && resultsRes.data) {
        const results = resultsRes.data.results || [];
        totalAttempts = results.length;
        if (totalAttempts > 0) {
          const passedCount = results.filter(r => r.passed).length;
          passRate = Math.round((passedCount / totalAttempts) * 100);
        }
      }

      setStats({ quizCount, totalAttempts, passRate });
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            🛡️ Admin Command Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Welcome back, {user?.name || 'Administrator'}!
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage quizzes, oversee student submissions, track performance statistics, and configure assessment modules.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Quizzes</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.quizCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
              📚
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Attempts</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalAttempts}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
              📝
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Pass Rate</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.passRate}%</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
              🎯
            </div>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg mb-3">
              ⚙️
            </div>
            <h3 className="text-xl font-bold text-slate-900">Quiz &amp; Question Management</h3>
            <p className="text-slate-500 text-sm mt-1">
              Create new quizzes, update titles and descriptions, add multiple-choice questions, set correct choices, or remove deprecated modules.
            </p>
          </div>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              to="/admin/quizzes"
              className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition shadow"
            >
              Manage Quizzes &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-3">
              📊
            </div>
            <h3 className="text-xl font-bold text-slate-900">Student Results &amp; Analytics</h3>
            <p className="text-slate-500 text-sm mt-1">
              View student submission records across all quizzes, filter results by specific quiz modules, track scores, percentages, and pass/fail statuses.
            </p>
          </div>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              to="/admin/results"
              className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition shadow"
            >
              View All Results &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
