import React from 'react';
import { Calendar } from 'lucide-react';

const Availability = ({ weeklyHours }) => {
  if (!weeklyHours || weeklyHours.length === 0) return null;

  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm mb-8">
      <h2 className="text-xl font-bold text-brand-secondary mb-4 flex items-center">
        <Calendar className="w-5 h-5 text-brand-primary mr-2" />
        Weekly Operating Schedule
      </h2>

      <div className="bg-brand-background border border-brand-border/60 rounded-xl overflow-hidden">
        <div className="divide-y divide-brand-border/50">
          {weeklyHours.map((schedule, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <span className="font-semibold text-brand-secondary">
                {schedule.dayOfWeek || schedule.day}
              </span>
              <div className="flex items-center space-x-2">
                {schedule.isAvailable ? (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-brand-text font-medium">
                      {schedule.startTime} – {schedule.endTime}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-brand-muted/40"></span>
                    <span className="text-brand-muted italic">Closed / Rest Day</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Availability;
