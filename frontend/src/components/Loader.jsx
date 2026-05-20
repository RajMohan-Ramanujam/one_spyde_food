import React from 'react';

const Loader = ({ fullPage = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-spyde-lightgray border-t-primary rounded-full animate-spin"></div>
      <span className="text-primary font-medium tracking-widest animate-pulse-subtle">
        ONE SPYDE
      </span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-spyde-black z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {spinner}
    </div>
  );
};

export default Loader;
