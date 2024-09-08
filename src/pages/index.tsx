import React from 'react';
import EnhancedDashboard from '@/components/EnhancedDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';

const Home = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <EnhancedDashboard />
      </div>
    </ErrorBoundary>
  );
};

export default Home;