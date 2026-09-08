import React from 'react';

const SkeletonLoader = ({ type = 'page' }) => {
  if (type === 'card') {
    return (
      <div className="bg-white rounded-3xl p-6 border-4 border-slate-200 animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded-xl w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
        <div className="h-10 bg-slate-200 rounded-2xl w-full mt-4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-pulse max-w-6xl mx-auto w-full py-4">
      {/* Hero Banner Skeleton */}
      <div className="bg-slate-200 rounded-3xl p-6 sm:p-8 h-48 border-4 border-slate-300 flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-300"></div>
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-slate-300 rounded-xl w-48"></div>
            <div className="h-4 bg-slate-300 rounded-lg w-64"></div>
          </div>
        </div>
        <div className="h-8 bg-slate-300 rounded-2xl w-36 self-end"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-7 bg-slate-200 rounded-xl w-40"></div>
            <div className="h-7 bg-slate-200 rounded-full w-32"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border-4 border-slate-200 h-44 space-y-3">
              <div className="h-5 bg-slate-200 rounded-lg w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
              <div className="h-10 bg-slate-200 rounded-2xl w-full mt-6"></div>
            </div>
            <div className="bg-white rounded-3xl p-6 border-4 border-slate-200 h-44 space-y-3">
              <div className="h-5 bg-slate-200 rounded-lg w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
              <div className="h-10 bg-slate-200 rounded-2xl w-full mt-6"></div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-4 border-slate-200 p-6 h-64 space-y-4">
            <div className="h-6 bg-slate-200 rounded-xl w-1/2"></div>
            <div className="h-10 bg-slate-200 rounded-2xl"></div>
            <div className="h-10 bg-slate-200 rounded-2xl"></div>
            <div className="h-10 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
