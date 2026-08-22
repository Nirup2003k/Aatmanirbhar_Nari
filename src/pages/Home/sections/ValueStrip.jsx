import React from 'react';
import { Rocket, Users, BookOpen } from 'lucide-react';

const ValueStrip = () => {
  const values = [
    {
      icon: <Rocket className="w-8 h-8 text-brand-primary" />,
      title: "Start Your Business",
      description: "Create a professional digital profile for your home-based skills in minutes."
    },
    {
      icon: <Users className="w-8 h-8 text-brand-primary" />,
      title: "Reach Local Customers",
      description: "Get discovered by people in your neighborhood looking for your services."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-brand-primary" />,
      title: "Learn & Grow",
      description: "Access easy-to-understand guidance on pricing, marketing, and more."
    }
  ];

  return (
    <section className="bg-brand-surface py-16 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {values.map((value, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-brand-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-5">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-secondary mb-3">
                {value.title}
              </h3>
              <p className="text-brand-text">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueStrip;
