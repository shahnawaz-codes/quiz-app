import React, { useEffect, useState } from 'react';
import { quizService } from '../../services/quizService';
import { resultService } from '../../services/resultService';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { formatDate } from '../../utils/formatters';
import { ShieldCheck, Trophy, CheckCircle2, Flame } from 'lucide-react';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuizzes = async () => {
    const res = await quizService.getQuizzes();
    if (res.success && res.data) {
      setQuizzes(res.data.quizzes || []);
    }
  };

  const fetchResults = async (quizId = '') => {
    setLoading(true);
    setError('');
    const res = await resultService.getAdminResults(quizId);

    if (res.success && res.data) {
      setResults(res.data.results || []);
    } else {
      setError(res.error || 'Failed to fetch student results.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
    fetchResults();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedQuizId(value);
    fetchResults(value);
  };

  const totalAttempts = results.length;
  const passedAttempts = results.filter(r => r.passed).length;
  const averagePercentage = totalAttempts > 0
    ? (results.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        icon={ShieldCheck}
        title="Student Battle Score Logs"
        subtitle="Monitor student submissions, victory rates, and quiz performance"
        badgeText="GUILD MASTER RECORDS"
      >
        <div className="flex items-center gap-2">
          <label htmlFor="quizFilter" className="text-xs font-black uppercase text-slate-700 font-cartoon whitespace-nowrap">
            Filter:
          </label>
          <select
            id="quizFilter"
            value={selectedQuizId}
            onChange={handleFilterChange}
            className="px-4 py-2.5 bg-amber-100 border-2 border-slate-900 rounded-2xl text-xs font-black font-cartoon focus:outline-none shadow-[0_3px_0_#0f172a]"
          >
            <option value="">All Quests</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Flame} title="TOTAL ATTEMPTS" value={totalAttempts} colorBg="bg-sky-500" colorText="text-white" />
        <StatCard icon={CheckCircle2} title="VICTORIES CLEARED" value={passedAttempts} colorBg="bg-emerald-500" colorText="text-white" />
        <StatCard icon={Trophy} title="AVERAGE ACCURACY" value={`${averagePercentage}%`} colorBg="bg-amber-400" colorText="text-slate-900" />
      </div>

      {error && (
        <div className="bg-rose-100 text-rose-900 border-3 border-slate-900 rounded-2xl p-4 text-xs font-black shadow-[0_4px_0_#0f172a]">
          ⚠️ {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : results.length === 0 ? (
        <div className="bg-white rounded-3xl border-4 border-slate-900 p-12 text-center shadow-[0_8px_0_#0f172a] space-y-4">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl font-black">
            📋
          </div>
          <h3 className="text-xl font-black text-slate-900 font-cartoon">No Submission Records</h3>
          <p className="text-slate-600 text-xs sm:text-sm font-bold max-w-md mx-auto">
            No quiz submissions found for the selected filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_#0f172a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-cartoon text-xs uppercase border-b-4 border-slate-900">
                  <th className="p-4">Student Hero</th>
                  <th className="p-4">Quest Title</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Accuracy</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Cleared</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 text-xs font-bold text-slate-800">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black">
                      <div className="font-cartoon text-slate-900">{r.student_name}</div>
                      <div className="text-[10px] text-slate-500">{r.student_email}</div>
                    </td>
                    <td className="p-4 font-cartoon text-sky-700">{r.quiz_title}</td>
                    <td className="p-4 font-cartoon font-black">
                      {r.score} / {r.total_questions}
                    </td>
                    <td className="p-4 font-cartoon font-black">{r.percentage}%</td>
                    <td className="p-4">
                      {r.passed ? (
                        <span className="bg-emerald-100 text-emerald-900 border-2 border-slate-900 px-2.5 py-0.5 rounded-full font-cartoon font-black text-[10px] shadow-[0_2px_0_#0f172a]">
                          VICTORY 🌟
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-900 border-2 border-slate-900 px-2.5 py-0.5 rounded-full font-cartoon font-black text-[10px] shadow-[0_2px_0_#0f172a]">
                          DEFEAT 💀
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500 text-[11px]">{formatDate(r.completed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
