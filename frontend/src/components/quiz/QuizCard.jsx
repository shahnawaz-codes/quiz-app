import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, HelpCircle, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { playButtonSound } from '../../utils/audio';

export default function QuizCard({ quiz, isAdmin = false, onEdit, onDelete, hasCompleted = false }) {
  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-slate-900 shadow-[0_8px_0_#0f172a] hover:translate-y-[-2px] transition-all duration-200 flex flex-col justify-between group">
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <span className="px-3 py-1 bg-amber-300 text-slate-900 rounded-2xl text-xs font-black border-2 border-slate-900 shadow-[0_2px_0_#0f172a] font-cartoon inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" /> QUEST #{quiz.id}
          </span>
          <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-2xl text-xs font-black border-2 border-slate-900 font-cartoon inline-flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-sky-700" /> {quiz.question_count} Qs
          </span>
        </div>

        <h3 className="text-xl font-black text-slate-900 font-cartoon leading-snug group-hover:text-sky-600 transition-colors">
          {quiz.title}
        </h3>
        
        <p className="text-slate-600 text-xs font-bold line-clamp-2 leading-relaxed">
          {quiz.description || 'No description provided for this quest.'}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t-2 border-slate-100 flex items-center justify-between gap-3">
        {isAdmin ? (
          <div className="flex items-center gap-2 w-full">
            <Link
              to={`/admin/quizzes/${quiz.id}/questions`}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs py-2.5 px-3 rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a] text-center font-cartoon transition flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" /> Questions
            </Link>
            <button
              onClick={() => onEdit && onEdit(quiz)}
              className="p-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a] transition"
              title="Edit Quiz"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete && onDelete(quiz.id)}
              className="p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a] transition"
              title="Delete Quiz"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to={`/quiz/${quiz.id}`}
            onClick={playButtonSound}
            className={`w-full font-black text-sm py-3 px-4 rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_#0f172a] text-center font-cartoon transition-all duration-150 flex items-center justify-center gap-2 ${
              hasCompleted
                ? 'bg-emerald-400 hover:bg-emerald-500 text-slate-900'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-900'
            }`}
          >
            {hasCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-900" /> Replay Quest
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-slate-900" /> Start Quest ⚡
              </>
            )}
          </Link>
        )}
      </div>
    </div>
  );
}
