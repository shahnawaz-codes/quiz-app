import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner;
