import React from 'react';
import { UserCheck, Award } from 'lucide-react';

const EntrepreneurInfo = ({ entrepreneur }) => {
  if (!entrepreneur) return null;

  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm mb-8">
      <h2 className="text-xl font-bold text-brand-secondary mb-6 flex items-center">
        <UserCheck className="w-5 h-5 text-brand-primary mr-2" />
        About the Entrepreneur
      </h2>

      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Entrepreneur Avatar Placeholder */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-background border-2 border-brand-border flex items-center justify-center text-brand-primary flex-shrink-0 shadow-sm">
          <UserCheck className="w-8 h-8 opacity-70" />
        </div>

        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-brand-secondary">
              {entrepreneur.name}
            </h3>
            {entrepreneur.experienceLevel && (
              <span className="inline-flex items-center text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full">
                <Award className="w-3 h-3 mr-1" />
                {entrepreneur.experienceLevel}
              </span>
            )}
          </div>

          <p className="text-sm text-brand-text leading-relaxed">
            {entrepreneur.bio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurInfo;
