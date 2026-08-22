import React from 'react';

const SectionHeading = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`text-center mb-10 ${className}`}>
      <h2 className="text-3xl font-bold text-brand-secondary mb-3">{title}</h2>
      {subtitle && (
        <p className="text-brand-muted max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;
