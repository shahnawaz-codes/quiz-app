import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';

const History = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      const res = await apiClient('/results/history.php');

      if (res.success && res.data) {
        setResults(res.data.results || []);
      } else {
        setError(res.error || 'Failed to load attempt history.');
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Quiz History</h2>
          <p className="text-sm text-slate-500">Review all your previous quiz attempts and test scores</p>
        </div>
        <Link
          to="/dashboard"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition text-sm flex items-center gap-2"
        >
          &larr; Take a Quiz
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : results.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            📜
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Attempts Recorded Yet</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You haven't completed any quizzes yet. Start a quiz to track your progress here!
          </p>
          <div>
            <Link
              to="/dashboard"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm shadow hover:bg-indigo-700 transition"
            >
              Browse Available Quizzes &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">#</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Quiz Title</th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider">Percentage</th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider">Attempted On</th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {results.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-400">
                      {results.length - idx}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      {r.quiz_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-800">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/result/${r.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-50 transition"
                      >
                        View Breakdown
                      </Link>
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

export default History;
