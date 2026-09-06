import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import confetti from 'canvas-confetti';
import { Trophy, Award, Sparkles, Flame, RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react';

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
        
        // Trigger celebratory confetti if passed!
        if (res.data.result.passed) {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#38BDF8', '#10B981', '#FF5252']
          });
        }
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
      <div className="max-w-md mx-auto my-12 bg-white border-4 border-slate-900 rounded-3xl p-8 text-center shadow-[0_8px_0_#0f172a] space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl shadow-sm">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-cartoon">Access Restricted</h2>
        <p className="text-xs font-bold text-slate-600">
          You do not have guild permission to view this quest summary.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="btn-cartoon-sky inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border-4 border-slate-900 rounded-3xl p-8 text-center shadow-[0_8px_0_#0f172a] space-y-4">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl shadow-sm">
          ❓
        </div>
        <h2 className="text-xl font-black text-slate-900 font-cartoon">Quest Log Not Found</h2>
        <p className="text-xs font-bold text-slate-600">{error || 'The requested battle attempt record does not exist.'}</p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="btn-cartoon-sky inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const passed = result.passed;
  const percentage = Math.round(result.percentage || 0);

  // Cartoon Rank Shield Logic
  let rankGrade = 'B-RANK CLEAR';
  let rankColor = 'bg-sky-400 text-slate-900';
  let rankIcon = '🛡️';

  if (percentage >= 90) {
    rankGrade = 'S-RANK SUPERSTAR';
    rankColor = 'bg-amber-400 text-slate-900';
    rankIcon = '👑';
  } else if (percentage >= 70) {
    rankGrade = 'A-RANK CLEAR';
    rankColor = 'bg-emerald-400 text-slate-900';
    rankIcon = '⚔️';
  } else if (percentage < 50) {
    rankGrade = 'PRACTICE REQUIRED';
    rankColor = 'bg-rose-400 text-white';
    rankIcon = '💔';
  }

  const expGained = Math.round((result.score / result.total_questions) * 350);

  return (
    <div className="max-w-xl mx-auto my-8">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_10px_0_#0f172a] overflow-hidden text-center space-y-6 pb-8 relative">
        {/* Cartoon Header */}
        <div className={`py-10 px-6 ${passed ? 'bg-amber-300 text-slate-900 border-b-4 border-slate-900' : 'bg-rose-400 text-white border-b-4 border-slate-900'} relative overflow-hidden`}>
          <div className={`w-20 h-20 rounded-3xl ${rankColor} border-4 border-slate-900 shadow-[0_5px_0_#0f172a] flex items-center justify-center mx-auto mb-4 text-4xl transform hover:scale-110 transition duration-300`}>
            {rankIcon}
          </div>

          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white text-slate-900 font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[0_2px_0_#0f172a] font-cartoon mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {rankGrade}
          </span>

          <h1 className="text-2xl sm:text-4xl font-black font-cartoon tracking-tight text-slate-900">
            {passed ? 'Quest Victory!' : 'Keep Practicing!'}
          </h1>
          <p className="text-xs font-bold text-slate-800 mt-1 max-w-sm mx-auto">
            {result.quiz_title}
          </p>
        </div>

        {/* Score & EXP Breakdown */}
        <div className="px-6 sm:px-8 space-y-6">
          <div className="p-6 bg-sky-50 rounded-3xl border-3 border-slate-900 shadow-[0_5px_0_#0f172a] max-w-md mx-auto space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 font-cartoon block">
              FINAL QUEST SCORE
            </span>
            <div className="text-5xl font-black text-slate-900 font-cartoon tracking-tight">
              {result.score} <span className="text-2xl font-bold text-slate-400">/ {result.total_questions}</span>
            </div>

            <div className="flex justify-center items-center gap-2 pt-1 font-cartoon">
              <span className={`px-4 py-1 rounded-full text-xs font-black border-2 border-slate-900 ${passed ? 'bg-emerald-300 text-slate-900' : 'bg-rose-300 text-slate-900'}`}>
                ACCURACY: {percentage}%
              </span>
              <span className="px-3.5 py-1 rounded-full bg-amber-300 text-slate-900 font-black text-xs border-2 border-slate-900 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-slate-900" /> +{expGained} EXP
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-bold tracking-wide">
            Completed on {new Date(result.completed_at).toLocaleString()}
          </div>

          <hr className="border-2 border-slate-100" />

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/dashboard"
              className="btn-cartoon-sky px-6 py-3.5 text-white rounded-2xl font-black shadow-md text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-white" />
              <span>Next Quest</span>
            </Link>
            <Link
              to="/history"
              className="btn-cartoon-yellow px-6 py-3.5 text-slate-900 rounded-2xl font-black text-xs sm:text-sm border-2 border-slate-900 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-slate-900" />
              <span>View Quest Log</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;


