import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { Swords, Flame, ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, Send } from 'lucide-react';

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
      <div className="max-w-xl mx-auto my-12 bg-white border-4 border-slate-900 rounded-3xl p-8 text-center shadow-[0_8px_0_#0f172a] space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-cartoon">Quest Unavailable</h2>
        <p className="text-xs font-bold text-slate-600">{error || 'This battle stage could not be located.'}</p>
        <Link
          to="/dashboard"
          className="btn-cartoon-sky inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const comboMultiplier = answeredCount > 2 ? 'x2.0' : answeredCount > 0 ? 'x1.5' : 'x1.0';

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24 relative">
      {/* Cartoon Quest Header */}
      <div className="bg-sky-600 rounded-3xl border-4 border-slate-900 p-6 sm:p-8 shadow-[0_8px_0_#0f172a] text-white space-y-5">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <Link to="/dashboard" className="text-xs font-black bg-white text-slate-900 px-3.5 py-1.5 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a] hover:bg-sky-100 flex items-center gap-1.5 transition font-cartoon">
            <ArrowLeft className="w-4 h-4" /> Retreat
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-amber-400 text-slate-900 px-3.5 py-1 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a] flex items-center gap-1 font-cartoon">
              <Flame className="w-3.5 h-3.5 text-slate-900" /> Combo {comboMultiplier}
            </span>
            <span className="text-xs font-black bg-emerald-400 text-slate-900 px-3 py-1 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a] font-cartoon">
              {answeredCount} / {totalQuestions} Answered
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-amber-300 text-slate-900 border-2 border-slate-900 font-black text-[10px] uppercase tracking-wider font-cartoon">
              Stage #{quiz.id}
            </span>
            <span className="text-xs font-black text-amber-200 flex items-center gap-1 font-cartoon">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Earn EXP Points
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-cartoon leading-tight drop-shadow-[0_2px_0_#0f172a]">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="text-xs sm:text-sm text-sky-100 mt-1 font-bold">{quiz.description}</p>
          )}
        </div>

        {/* Quest Progress Tracker */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-black text-white font-cartoon">
            <span>STAGE PROGRESS</span>
            <span>{progressPercent}% COMPLETE</span>
          </div>
          <div className="w-full bg-sky-900 rounded-full h-4 p-0.5 overflow-hidden border-2 border-slate-900">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-300 border border-slate-900 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-100 text-rose-900 border-3 border-slate-900 rounded-2xl p-4 text-sm font-black shadow-[0_4px_0_#0f172a] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" /> {error}
        </div>
      )}

      {/* Questions List */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];

          return (
            <div
              key={q.id}
              className={`bg-white rounded-3xl border-3 border-slate-900 transition-all duration-200 p-6 sm:p-8 shadow-[0_6px_0_#0f172a] space-y-6 ${
                isAnswered ? 'bg-sky-50/60 ring-2 ring-sky-400' : ''
              }`}
            >
              <div className="flex gap-3.5 items-start">
                <span className="bg-amber-400 text-slate-900 border-2 border-slate-900 font-black text-xs px-3 py-1.5 rounded-2xl shadow-[0_2px_0_#0f172a] mt-0.5 font-cartoon">
                  STAGE {idx + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug font-cartoon">
                  {q.question_text}
                </h3>
              </div>

              {/* Cartoon Option Buttons (A), (B), (C), (D) */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {['a', 'b', 'c', 'd'].map((optKey) => {
                  const optText = q[`option_${optKey}`];
                  const isSelected = answers[q.id] === optKey;

                  return (
                    <label
                      key={optKey}
                      onClick={() => handleOptionSelect(q.id, optKey)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-3 border-slate-900 cursor-pointer transition-all duration-150 transform hover:scale-[1.01] ${
                        isSelected
                          ? 'bg-amber-300 text-slate-900 shadow-[0_4px_0_#0f172a] font-black scale-[1.01]'
                          : 'bg-white hover:bg-sky-50 text-slate-900 shadow-[0_3px_0_#0f172a] font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-8 h-8 rounded-xl border-2 border-slate-900 font-black text-xs flex items-center justify-center font-cartoon transition-all ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'bg-sky-100 text-slate-900'
                          }`}
                        >
                          {optKey.toUpperCase()}
                        </span>
                        <span className="text-sm">{optText}</span>
                      </div>

                      <div className="w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center bg-white">
                        {isSelected ? (
                          <div className="w-3.5 h-3.5 bg-slate-900 rounded-full"></div>
                        ) : (
                          <div className="w-3 h-3 rounded-full border-slate-300"></div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Sticky Submit Bar at Bottom */}
        <div className="sticky bottom-4 z-40 bg-white p-4 sm:p-5 rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_#0f172a] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs font-black text-slate-900 text-center sm:text-left font-cartoon">
            <span>{totalQuestions - answeredCount} Question(s) Remaining</span>
            <p className="text-[11px] text-slate-500 font-bold">Submit to calculate score and rank XP</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-cartoon-yellow w-full sm:w-auto px-8 py-3.5 text-slate-900 text-sm shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Send className="w-4 h-4 text-slate-900" />
            <span>{submitting ? 'Calculating Score...' : 'Submit Battle Attempt ✓'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeQuiz;


