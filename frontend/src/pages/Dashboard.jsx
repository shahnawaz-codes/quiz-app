import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError('');
      const res = await apiClient('/quizzes/list.php');
      if (res.success && res.data) {
        setQuizzes(res.data.quizzes || []);
      } else {
        setError(res.error || 'Failed to fetch quizzes.');
      }
      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-8 text-white shadow-xl flex flex-wrap justify-between items-center gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold mb-2 border border-indigo-500/30">
            Student Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name}!
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Select an available quiz below to test your knowledge, or review your previous attempts in the history tab.
          </p>
        </div>

        <Link
          to="/history"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 backdrop-blur-sm"
        >
          📜 My Quiz History
        </Link>
      </div>

      {/* Available Quizzes Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Available Quizzes</h2>
          <p className="text-sm text-slate-500">Pick a module to begin your assessment</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Quizzes List */}
      {loading ? (
        <LoadingSpinner />
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            📚
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Quizzes Available Yet</h3>
          <p className="text-slate-500 text-sm">Please check back later when an instructor creates a quiz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{quiz.title}</h3>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3">
                  {quiz.description || 'No description available for this quiz.'}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                    ❓ {quiz.question_count} Question{quiz.question_count === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                {quiz.question_count > 0 ? (
                  <Link
                    to={`/quiz/${quiz.id}`}
                    className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow transition text-sm flex items-center justify-center gap-2"
                  >
                    Start Quiz &rarr;
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full text-center bg-slate-100 text-slate-400 font-medium py-2.5 px-4 rounded-lg text-sm cursor-not-allowed"
                  >
                    No Questions Added
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
