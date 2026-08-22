import React from 'react';
import SectionHeading from '../../../components/common/SectionHeading';
import { Search, Eye, MessageCircle, UserPlus, ListPlus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';

const HowItWorks = () => {
  const customerSteps = [
    {
      icon: <Search className="w-6 h-6 text-brand-secondary" />,
      title: "1. Discover",
      description: "Find women-led businesses near you."
    },
    {
      icon: <Eye className="w-6 h-6 text-brand-secondary" />,
      title: "2. Explore",
      description: "View services, pricing, availability, and business details."
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-brand-secondary" />,
      title: "3. Connect",
      description: "Send an inquiry directly to the entrepreneur."
    }
  ];

  const entrepreneurSteps = [
    {
      icon: <UserPlus className="w-6 h-6 text-brand-primary" />,
      title: "1. Create your profile",
      description: "Sign up and set up your business details."
    },
    {
      icon: <ListPlus className="w-6 h-6 text-brand-primary" />,
      title: "2. Add your services",
      description: "List what you offer along with pricing and availability."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-brand-primary" />,
      title: "3. Get discovered",
      description: "Connect with local customers and grow."
    }
  ];

  return (
    <section id="how-it-works" className="bg-brand-background py-20 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="How It Works" 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          
          {/* Customer Path */}
          <div className="bg-brand-surface rounded-2xl p-8 border border-brand-border shadow-sm">
            <h3 className="text-2xl font-bold text-brand-secondary mb-8 text-center">For Customers</h3>
            <div className="space-y-8 relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-brand-border -z-10"></div>
              
              {customerSteps.map((step, index) => (
                <div key={index} className="flex relative">
                  <div className="flex-shrink-0 mr-4 bg-brand-surface">
                    <div className="w-12 h-12 rounded-full bg-brand-background border-2 border-brand-border flex items-center justify-center text-brand-secondary font-bold shadow-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h4 className="text-lg font-semibold text-brand-secondary mb-1 flex items-center">
                      {step.icon}
                      <span className="ml-2">{step.title.split('. ')[1]}</span>
                    </h4>
                    <p className="text-brand-text">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/businesses">
                <Button variant="outline" className="w-full sm:w-auto">
                  Find Businesses
                </Button>
              </Link>
            </div>
          </div>

          {/* Entrepreneur Path */}
          <div className="bg-brand-surface rounded-2xl p-8 border border-brand-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full -z-10"></div>
            <h3 className="text-2xl font-bold text-brand-primary mb-2 text-center">Want to start your own business?</h3>
            <p className="text-center text-brand-text mb-8">Join our community of women entrepreneurs.</p>
            
            <div className="space-y-8 relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-brand-primary/20 -z-10"></div>
              
              {entrepreneurSteps.map((step, index) => (
                <div key={index} className="flex relative">
                  <div className="flex-shrink-0 mr-4 bg-brand-surface">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 border-2 border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold shadow-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h4 className="text-lg font-semibold text-brand-secondary mb-1 flex items-center">
                      {step.icon}
                      <span className="ml-2">{step.title.split('. ')[1]}</span>
                    </h4>
                    <p className="text-brand-text">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/auth/register">
                <Button variant="primary" className="w-full sm:w-auto">
                  Start Your Business
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
