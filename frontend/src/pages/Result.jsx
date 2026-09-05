import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';

const Result = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError('');
      setForbidden(false);

      const res = await apiClient(`/results/get.php?id=${resultId}`);

      if (res.success && res.data && res.data.result) {
        setResult(res.data.result);
      } else {
        if (res.error && res.error.includes('Access Denied')) {
          setForbidden(true);
        } else {
          setError(res.error || 'Failed to fetch result details.');
        }
      }
      setLoading(false);
    };

    fetchResult();
  }, [resultId]);

  if (loading) return <LoadingSpinner />;

  if (forbidden) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-red-200 rounded-2xl p-8 text-center shadow-lg space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          🚫
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Access Denied (403)</h2>
        <p className="text-sm text-slate-600">
          You do not have permission to view this quiz result.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-block px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition"
          >
            &larr; Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-md space-y-4">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          ❓
        </div>
        <h2 className="text-xl font-bold text-slate-900">Result Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'The requested quiz result does not exist.'}</p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm shadow transition hover:bg-indigo-700"
          >
            &larr; Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const passed = result.passed;

  return (
    <div className="max-w-2xl mx-auto my-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-center space-y-6 pb-8">
        {/* Banner Header */}
        <div className={`py-8 px-6 text-white ${passed ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-rose-600 to-red-700'}`}>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 text-3xl">
            {passed ? '🎉' : '❌'}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {passed ? 'Quiz Completed — Passed!' : 'Quiz Completed — Keep Practicing!'}
          </h1>
          <p className="text-sm opacity-90 mt-1 font-medium">{result.quiz_title}</p>
        </div>

        {/* Score Breakdown */}
        <div className="px-8 space-y-6">
          <div className="py-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Final Score</span>
            <div className={`text-5xl font-black my-2 ${passed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {result.score} <span className="text-2xl font-bold text-slate-400">/ {result.total_questions}</span>
            </div>
            <div className="inline-flex items-center gap-1">
              <span className={`px-3 py-1 rounded-full text-sm font-extrabold ${passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {result.percentage}%
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Attempted on {new Date(result.completed_at).toLocaleString()}
          </div>

          <hr className="border-slate-100" />

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow transition text-sm"
            >
              Take Another Quiz
            </Link>
            <Link
              to="/history"
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition text-sm border border-slate-200"
            >
              View Quiz History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
