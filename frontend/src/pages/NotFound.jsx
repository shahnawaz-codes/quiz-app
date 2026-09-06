import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  const homePath = user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login';

  return (
    <div className="max-w-md mx-auto my-16 bg-white border-4 border-slate-900 rounded-3xl p-8 text-center shadow-[0_8px_0_#0f172a] space-y-6">
      <div className="w-20 h-20 bg-amber-400 border-4 border-slate-900 text-slate-900 rounded-3xl flex items-center justify-center mx-auto text-3xl font-black shadow-[0_4px_0_#0f172a] transform -rotate-3">
        404 🗺️
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">QUEST LOST!</h1>
        <p className="text-base font-bold text-slate-600">
          Whoops! You wandered off the map into uncharted territory.
        </p>
      </div>

      <div>
        <Link
          to={homePath}
          className="inline-flex items-center px-6 py-3 bg-sky-500 hover:bg-sky-400 active:translate-y-1 text-white rounded-2xl font-black border-2 border-slate-900 shadow-[0_4px_0_#0f172a] transition-all text-base"
        >
          &larr; RETURN TO HQ 🏠
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
