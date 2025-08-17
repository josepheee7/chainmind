import React from 'react';

const StakingTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Staking Test Page</h1>
        <div className="bg-gray-800 rounded-xl p-6">
          <p className="text-white">This is a test staking page to debug the routing issue.</p>
          <p className="text-gray-400 mt-2">If you can see this, the routing is working.</p>
        </div>
      </div>
    </div>
  );
};

export default StakingTest;