import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resultService } from '../services/resultService';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import { getScoreGrade, formatDate } from '../utils/formatters';
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

      const res = await resultService.getResultById(resultId);

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
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-cartoon">Access Restricted</h2>
        <p className="text-xs font-bold text-slate-600">
          You do not have guild permission to view this quest summary.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="btn-cartoon-sky inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs"
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
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl">
          ❓
        </div>
        <h2 className="text-xl font-black text-slate-900 font-cartoon">Quest Log Not Found</h2>
        <p className="text-xs font-bold text-slate-600">{error || 'The requested battle attempt record does not exist.'}</p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="btn-cartoon-sky inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const passed = result.passed;
  const percentage = Math.round(result.percentage || 0);
  const gradeInfo = getScoreGrade(percentage);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <PageHeader
        icon={Trophy}
        title="Battle Quest Result Card"
        subtitle={`Summary performance for ${result.quiz_title}`}
        badgeText={`BATTLE LOG #${result.id}`}
      >
        <Link
          to={`/quiz/${result.quiz_id}`}
          className="btn-cartoon-yellow px-4 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Replay Quest
        </Link>
      </PageHeader>

      {/* Main Score Hero Card */}
      <div className="bg-white rounded-3xl p-8 border-4 border-slate-900 shadow-[0_10px_0_#0f172a] text-center space-y-6">
        <div className="inline-block p-4 rounded-3xl bg-amber-100 border-3 border-slate-900 shadow-[0_4px_0_#0f172a]">
          <span className="text-6xl">{passed ? '🏆' : '💀'}</span>
        </div>

        <div>
          <span className={`inline-block px-4 py-1 rounded-full text-xs font-black font-cartoon uppercase tracking-wider border-2 border-slate-900 shadow-[0_2px_0_#0f172a] mb-2 ${gradeInfo.bg} ${gradeInfo.color}`}>
            GRADE {gradeInfo.grade} • {gradeInfo.label}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-cartoon">
            {passed ? 'QUEST CONQUERED!' : 'QUEST DEFEATED'}
          </h2>
          <p className="text-xs font-bold text-slate-500 mt-1">
            {passed ? 'Great battle execution, hero! XP points credited.' : 'Keep practicing and re-try the quest to gain mastery!'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <StatCard icon={Trophy} title="CORRECT ANSWERS" value={`${result.score} / ${result.total_questions}`} colorBg="bg-sky-500" colorText="text-white" />
          <StatCard icon={Sparkles} title="ACCURACY PERCENT" value={`${percentage}%`} colorBg="bg-amber-400" colorText="text-slate-900" />
          <StatCard icon={Flame} title="EXP REWARD" value={`+${result.score * 100} XP`} colorBg="bg-emerald-500" colorText="text-white" />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/dashboard"
            className="btn-cartoon-sky w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Arena
          </Link>
          <Link
            to="/history"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border-3 border-slate-900 rounded-2xl text-xs font-black font-cartoon uppercase tracking-wider shadow-[0_4px_0_#0f172a] text-center"
          >
            View Quest Log
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
