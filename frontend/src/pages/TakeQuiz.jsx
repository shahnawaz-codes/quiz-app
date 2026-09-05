import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError('');
      const res = await apiClient(`/quizzes/get.php?id=${quizId}`);

      if (res.success && res.data && res.data.quiz) {
        setQuiz(res.data.quiz);
      } else {
        setError(res.error || 'Failed to load quiz details.');
      }
      setLoading(false);
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionSelect = (questionId, optionKey) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quiz || !quiz.questions || quiz.questions.length === 0) return;

    setSubmitting(true);
    setError('');

    const res = await apiClient('/results/submit.php', {
      method: 'POST',
      body: JSON.stringify({
        quiz_id: parseInt(quizId, 10),
        answers: answers
      })
    });

    setSubmitting(false);

    if (res.success && res.data && res.data.result_id) {
      navigate(`/result/${res.data.result_id}`);
    } else {
      setError(res.error || 'Failed to submit quiz attempt.');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !quiz) {
    return (
      <div className="max-w-xl mx-auto my-8 bg-white border border-red-200 rounded-xl p-8 text-center shadow-sm space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-slate-900">Quiz Unavailable</h2>
        <p className="text-sm text-slate-600">{error || 'Quiz not found.'}</p>
        <Link
          to="/dashboard"
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 relative">
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <Link to="/dashboard" className="text-xs font-semibold text-indigo-600 hover:underline">
            &larr; Cancel and Return to Dashboard
          </Link>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-100">
            {answeredCount} of {totalQuestions} Answered
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{quiz.title}</h1>
          {quiz.description && <p className="text-sm text-slate-500 mt-1">{quiz.description}</p>}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex gap-3 items-start">
              <span className="bg-slate-900 text-white font-bold text-xs px-2.5 py-1 rounded-md mt-0.5">
                Q{idx + 1}
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {q.question_text}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {['a', 'b', 'c', 'd'].map((optKey) => {
                const optText = q[`option_${optKey}`];
                const isSelected = answers[q.id] === optKey;

                return (
                  <label
                    key={optKey}
                    onClick={() => handleOptionSelect(q.id, optKey)}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-indigo-950 font-medium'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${q.id}`}
                      value={optKey}
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="font-bold uppercase text-xs w-5 text-slate-400">
                      ({optKey})
                    </span>
                    <span className="text-sm">{optText}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Sticky Submit Bar at Bottom */}
        <div className="sticky bottom-0 bg-slate-50/95 backdrop-blur-sm py-4 border-t border-slate-200 shadow-lg z-20 flex justify-end items-center px-4 rounded-xl">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition text-base disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? 'Calculating Score...' : 'Submit Quiz Attempt ✓'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeQuiz;
