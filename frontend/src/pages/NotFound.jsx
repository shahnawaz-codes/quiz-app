import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  const homePath = user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login';

  return (
    <div className="max-w-md mx-auto my-16 bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-lg space-y-6">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-3xl font-extrabold">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
        <p className="text-sm text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <div>
        <Link
          to={homePath}
          className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow transition text-sm"
        >
          &larr; Return to Safety
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
