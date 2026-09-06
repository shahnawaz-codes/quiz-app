import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuizzes = async () => {
    const res = await apiClient('/quizzes/list.php');
    if (res.success && res.data) {
      setQuizzes(res.data.quizzes || []);
    }
  };

  const fetchResults = async (quizId = '') => {
    setLoading(true);
    setError('');
    const endpoint = quizId ? `/results/admin-list.php?quiz_id=${quizId}` : '/results/admin-list.php';
    const res = await apiClient(endpoint);

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
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-[0_6px_0_#0f172a]">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🏆 PLAYER SCORE LOGS
          </h2>
          <p className="text-sm font-bold text-slate-500">Monitor all quiz submissions across your platform</p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-3">
          <label htmlFor="quizFilter" className="text-xs font-black uppercase text-slate-700 whitespace-nowrap">
            Filter by Quest:
          </label>
          <select
            id="quizFilter"
            value={selectedQuizId}
            onChange={handleFilterChange}
            className="px-4 py-2.5 bg-sky-50 border-2 border-slate-900 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sky-200 shadow-[0_4px_0_#0f172a]"
          >
            <option value="">All Quests</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-sky-100 rounded-3xl p-5 border-4 border-slate-900 shadow-[0_6px_0_#0f172a] text-center">
          <span className="text-xs font-black uppercase text-slate-600 tracking-wider">Total Battle Attempts</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalAttempts} ⚔️</p>
        </div>
        <div className="bg-emerald-100 rounded-3xl p-5 border-4 border-slate-900 shadow-[0_6px_0_#0f172a] text-center">
          <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">Victories Cleared</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">{passedAttempts} 🌟</p>
        </div>
        <div className="bg-amber-100 rounded-3xl p-5 border-4 border-slate-900 shadow-[0_6px_0_#0f172a] text-center">
          <span className="text-xs font-black uppercase text-amber-800 tracking-wider">Guild Average</span>
          <p className="text-3xl font-black text-amber-700 mt-1">{averagePercentage}% ⚡</p>
        </div>
      </div>

      {error && (
        <div className="bg-coral-100 text-coral-800 border-2 border-coral-500 rounded-2xl p-4 text-sm font-bold shadow-[0_4px_0_#ef4444]">
          ⚠️ {error}
        </div>
      )}

      {/* Results Table */}
      {loading ? (
        <LoadingSpinner />
      ) : results.length === 0 ? (
        <div className="bg-white rounded-3xl border-4 border-slate-900 p-12 text-center shadow-[0_6px_0_#0f172a]">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 border-2 border-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-black shadow-[0_4px_0_#0f172a]">
            📜
          </div>
          <p className="text-slate-900 font-black text-xl mb-1">No Quest Logs Found!</p>
          <p className="text-slate-500 font-bold text-sm">
            {selectedQuizId ? 'No players have tackled this quest yet.' : 'No players have submitted any battle results yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_#0f172a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-4 divide-slate-900">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-amber-300">Player</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-sky-300">Quest Title</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Accuracy</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-300">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 bg-white font-bold text-sm">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-sky-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-black text-slate-900">{r.student_name}</div>
                      <div className="text-xs font-bold text-slate-400">{r.student_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-800">
                      {r.quiz_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-base font-black text-slate-900">
                      {r.score} / {r.total_questions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 shadow-[0_2px_0_#0f172a] ${
                        r.passed ? 'bg-emerald-400 text-slate-900' : 'bg-coral-400 text-white'
                      }`}>
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 shadow-[0_2px_0_#0f172a] ${
                        r.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-coral-100 text-coral-800'
                      }`}>
                        {r.passed ? 'CLEARED 🌟' : 'FAILED 💔'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-slate-500 font-bold">
                      {new Date(r.completed_at).toLocaleString()}
                    </td>
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
