import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShieldCheck, BookOpen, Users, Award, ChevronRight, Settings, BarChart2 } from 'lucide-react';

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
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border-4 border-slate-900 shadow-[0_10px_0_#0f172a] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-slate-900 border-2 border-slate-900 text-xs font-black uppercase tracking-wider font-cartoon shadow-[0_2px_0_#0f172a]">
            <ShieldCheck className="w-4 h-4 text-slate-900" /> Guild Master Console
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-cartoon tracking-tight text-white drop-shadow-[0_2px_0_#0f172a]">
            Welcome back, Master <span className="text-amber-300">{user?.name || 'Administrator'}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-bold leading-relaxed">
            Manage active quiz stages, oversee student battle submissions, monitor performance statistics, and configure assessment modules.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[0_6px_0_#0f172a] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 font-cartoon">Total Active Quests</p>
              <h3 className="text-3xl font-black text-slate-900 font-cartoon mt-1">{stats.quizCount}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-sky-100 border-2 border-slate-900 text-sky-600 flex items-center justify-center text-2xl font-black shadow-sm">
              <BookOpen className="w-7 h-7 text-sky-600" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[0_6px_0_#0f172a] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 font-cartoon">Adventurer Attempts</p>
              <h3 className="text-3xl font-black text-slate-900 font-cartoon mt-1">{stats.totalAttempts}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-slate-900 text-emerald-600 flex items-center justify-center text-2xl font-black shadow-sm">
              <Users className="w-7 h-7 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[0_6px_0_#0f172a] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 font-cartoon">Guild Clear Rate</p>
              <h3 className="text-3xl font-black text-slate-900 font-cartoon mt-1">{stats.passRate}%</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-slate-900 text-amber-600 flex items-center justify-center text-2xl font-black shadow-sm">
              <Award className="w-7 h-7 text-amber-600" />
            </div>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-900 shadow-[0_6px_0_#0f172a] hover:shadow-[0_10px_0_#0f172a] transition space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-xl mb-3 shadow-sm">
              <Settings className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-cartoon">Quest &amp; Question Management</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 leading-relaxed">
              Create new battle stages, update titles and descriptions, add multiple-choice questions, set correct choices, or remove deprecated modules.
            </p>
          </div>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              to="/admin/quizzes"
              className="btn-cartoon-sky text-white px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wider"
            >
              <span>Manage Quests</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-900 shadow-[0_6px_0_#0f172a] hover:shadow-[0_10px_0_#0f172a] transition space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-xl mb-3 shadow-sm">
              <BarChart2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-cartoon">Adventurer Results &amp; Analytics</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 leading-relaxed">
              View student submission records across all quizzes, filter results by specific quiz modules, track scores, percentages, and pass/fail statuses.
            </p>
          </div>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              to="/admin/results"
              className="btn-cartoon-green text-white px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wider"
            >
              <span>View Guild Records</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


