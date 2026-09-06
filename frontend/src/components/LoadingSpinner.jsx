import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-slate-900 shadow-md" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner;
