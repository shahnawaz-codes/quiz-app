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
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Student Quiz Results</h2>
          <p className="text-sm text-slate-500">Monitor all quiz submissions across your platform</p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-3">
          <label htmlFor="quizFilter" className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            Filter by Quiz:
          </label>
          <select
            id="quizFilter"
            value={selectedQuizId}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          >
            <option value="">All Quizzes</option>
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
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Total Attempts</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalAttempts}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Passed Attempts</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{passedAttempts}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Average Percentage</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{averagePercentage}%</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Results Table */}
      {loading ? (
        <LoadingSpinner />
      ) : results.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
            📋
          </div>
          <p className="text-slate-600 font-semibold mb-1">No quiz results found.</p>
          <p className="text-slate-400 text-sm">
            {selectedQuizId ? 'No students have taken this specific quiz yet.' : 'No students have submitted any quizzes yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Student</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Quiz Title</th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider">Percentage</th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{r.student_name}</div>
                      <div className="text-xs text-slate-400">{r.student_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                      {r.quiz_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-900">
                      {r.score} / {r.total_questions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        r.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        r.passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {r.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-slate-500 font-medium">
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
