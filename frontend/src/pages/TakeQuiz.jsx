import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { resultService } from '../services/resultService';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/common/PageHeader';
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
      const res = await quizService.getQuizById(quizId);

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

    const res = await resultService.submitQuiz(parseInt(quizId, 10), answers);

    setSubmitting(false);

    if (res.success && res.data && res.data.result_id) {
      navigate(`/result/${res.data.result_id}`);
    } else {
      setError(res.error || 'Failed to submit quiz answers.');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !quiz) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center py-12">
        <div className="bg-rose-100 border-4 border-slate-900 rounded-3xl p-8 shadow-[0_8px_0_#0f172a] space-y-4">
          <ShieldAlert className="w-16 h-16 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900 font-cartoon">Quest Unavailable</h2>
          <p className="text-slate-600 font-bold text-xs sm:text-sm">{error || 'Quest details could not be found.'}</p>
          <Link
            to="/dashboard"
            className="btn-cartoon-yellow inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Quest Arena
          </Link>
        </div>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <PageHeader
        icon={Swords}
        title={quiz.title}
        subtitle={quiz.description || 'Answer all questions below and submit to calculate your score'}
        badgeText={`BATTLE ARENA #${quiz.id}`}
      >
        <Link
          to="/dashboard"
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-2xl text-xs font-black text-slate-800 flex items-center justify-center gap-1.5 font-cartoon"
        >
          <ArrowLeft className="w-4 h-4" /> Exit
        </Link>
      </PageHeader>

      {/* Battle Progress Indicator */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-4 border-slate-900 shadow-[0_6px_0_#0f172a] space-y-2">
        <div className="flex justify-between items-center text-xs font-black font-cartoon">
          <span className="flex items-center gap-1 text-slate-900">
            <Flame className="w-4 h-4 text-amber-500" /> QUEST PROGRESS
          </span>
          <span className="text-sky-600">{answeredCount} of {questions.length} Answered ({progressPercent}%)</span>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full border-2 border-slate-900 overflow-hidden">
          <div
            className="h-full bg-sky-500 border-r-2 border-slate-900 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => {
          const selectedChoice = answers[q.id];
          return (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-6 border-4 border-slate-900 shadow-[0_8px_0_#0f172a] space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-2xl bg-amber-400 border-2 border-slate-900 text-slate-900 font-black text-xs flex items-center justify-center font-cartoon shrink-0 shadow-[0_2px_0_#0f172a]">
                  {idx + 1}
                </span>
                <h3 className="text-lg font-black text-slate-900 font-cartoon pt-0.5">
                  {q.question_text}
                </h3>
              </div>

              {/* Choices Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { key: 'a', val: q.option_a, label: 'A' },
                  { key: 'b', val: q.option_b, label: 'B' },
                  { key: 'c', val: q.option_c, label: 'C' },
                  { key: 'd', val: q.option_d, label: 'D' }
                ].map((opt) => {
                  const isSelected = selectedChoice === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleOptionSelect(q.id, opt.key)}
                      className={`p-4 rounded-2xl border-3 border-slate-900 text-left transition-all duration-150 flex items-center justify-between font-bold text-xs ${
                        isSelected
                          ? 'bg-amber-300 text-slate-900 shadow-[0_4px_0_#0f172a] scale-[1.02] ring-2 ring-amber-400'
                          : 'bg-slate-50 hover:bg-sky-100 text-slate-800 shadow-[0_2px_0_#0f172a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl border-2 border-slate-900 flex items-center justify-center font-black text-xs font-cartoon ${
                          isSelected ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
                        }`}>
                          {opt.label}
                        </span>
                        <span>{opt.val}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-slate-900 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-cartoon-sky w-full py-4 px-6 rounded-3xl text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_0_#0f172a]"
          >
            <Send className="w-5 h-5" />
            <span>{submitting ? 'Calculating Battle Score...' : 'Submit Battle Quest ⚡'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeQuiz;
