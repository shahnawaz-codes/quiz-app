import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resultService } from '../services/resultService';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/common/PageHeader';
import { formatDate } from '../utils/formatters';
import { Scroll, Trophy, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

const History = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      const res = await resultService.getUserHistory();

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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        icon={Scroll}
        title="Adventurer Quest Log"
        subtitle="Review all your previous battle attempts and test scores"
        badgeText="PLAYER HISTORY"
      >
        <Link
          to="/dashboard"
          className="btn-cartoon-sky text-white px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center gap-2"
        >
          <Trophy className="w-4 h-4 text-white" />
          <span>New Quest</span>
        </Link>
      </PageHeader>

      {error && (
        <div className="bg-rose-100 text-rose-900 border-3 border-slate-900 rounded-2xl p-4 text-sm font-black shadow-[0_4px_0_#0f172a]">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : results.length === 0 ? (
        <div className="bg-white rounded-3xl border-4 border-slate-900 p-12 text-center shadow-[0_8px_0_#0f172a] space-y-4">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl shadow-sm">
            📜
          </div>
          <h3 className="text-xl font-black text-slate-900 font-cartoon">No Quests Completed Yet</h3>
          <p className="text-slate-600 font-bold text-xs sm:text-sm max-w-md mx-auto">
            You haven't undertaken any battle attempts yet. Enter a quest from the dashboard to track your history here!
          </p>
          <div>
            <Link
              to="/dashboard"
              className="btn-cartoon-yellow inline-flex items-center gap-2 px-6 py-3 text-slate-900 rounded-2xl text-xs font-black shadow-md uppercase tracking-wider"
            >
              <span>Explore Active Quests</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_#0f172a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-slate-900">
              <thead className="bg-slate-900 text-white font-cartoon">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">#</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Quest Title</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Accuracy</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider">Attempted On</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 bg-white font-bold text-slate-900">
                {results.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-sky-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-sky-700 font-cartoon">
                      #{results.length - idx}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900 font-cartoon">
                      {r.quiz_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-black text-slate-900 font-cartoon">
                      {r.score} / {r.total_questions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-black text-slate-900 font-cartoon">
                      {r.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {r.passed ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border-2 border-slate-900 px-3 py-1 rounded-full text-xs font-black font-cartoon shadow-[0_2px_0_#0f172a]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> VICTORY
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 border-2 border-slate-900 px-3 py-1 rounded-full text-xs font-black font-cartoon shadow-[0_2px_0_#0f172a]">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> DEFEAT
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-slate-500 font-bold">
                      {formatDate(r.completed_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <Link
                        to={`/result/${r.id}`}
                        className="inline-flex items-center gap-1 bg-sky-100 hover:bg-sky-200 text-sky-900 border-2 border-slate-900 px-3 py-1 rounded-xl font-black font-cartoon transition shadow-[0_2px_0_#0f172a]"
                      >
                        <span>Card</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
