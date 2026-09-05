import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  // Redirect authenticated users directly to their active dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return (
    <div className="space-y-20 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-8 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-semibold border border-indigo-100 shadow-sm">
          ✨ Fast, Secure &amp; Interactive Learning
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Master any topic with instant, interactive online quizzes.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Register as a student to test your knowledge with real-time server scoring, or log in as an administrator to build custom quiz option banks.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/25 transition text-base text-center"
          >
            Get Started &rarr;
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold transition text-base text-center"
          >
            Sign In to Account
          </Link>
        </div>

        {/* Hero Illustrative Mockup Element */}
        <div className="pt-6">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8 text-left space-y-6 transform hover:-translate-y-1 transition duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-400 ml-2">PHP &amp; Web Development Quiz</span>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Score: 100% Passed
              </span>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Question 1 of 5</div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">What does PDO stand for in PHP web development?</h3>
            </div>

            <div className="space-y-2">
              <div className="p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-3">
                <span className="font-bold text-slate-400">A</span> PHP Data Output
              </div>
              <div className="p-3.5 rounded-xl border border-indigo-600 bg-indigo-50/70 text-xs sm:text-sm font-bold text-indigo-950 flex items-center gap-3 ring-2 ring-indigo-500/20">
                <span className="font-bold text-indigo-600">B</span> PHP Data Objects ✓
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-3">
                <span className="font-bold text-slate-400">C</span> Process Database Optimization
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Features Section */}
      <section className="space-y-12 max-w-5xl mx-auto px-4 pt-4">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Built for Students &amp; Administrators
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Everything you need for online assessment in one streamlined platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-slate-900">Instant Server Scoring</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Quiz attempts are evaluated securely on the server with instant percentage and pass/fail feedback.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
              📜
            </div>
            <h3 className="text-xl font-bold text-slate-900">Attempt History Tracking</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Students can review their complete attempt history, scores, percentages, and completed timestamps.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
              🛡️
            </div>
            <h3 className="text-xl font-bold text-slate-900">Admin Quiz Management</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Instructors can create custom quizzes, author option banks, and monitor student submission records.
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="pt-12 border-t border-slate-200 text-center space-y-4">
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/login" className="hover:text-indigo-600 transition">Student Login</Link>
          <Link to="/register" className="hover:text-indigo-600 transition">Student Registration</Link>
          <Link to="/admin/login" className="hover:text-indigo-600 transition">Admin Portal</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
