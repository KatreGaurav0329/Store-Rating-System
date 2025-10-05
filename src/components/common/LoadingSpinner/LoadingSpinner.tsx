// src/components/common/LoadingSpinner/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner" style={{ textAlign: 'center', padding: '32px' }}>
    <div className="spinner-border text-primary" role="status" aria-label="Loading...">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner;
