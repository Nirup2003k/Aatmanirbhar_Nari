import React from 'react';
import SectionHeading from '../../../components/common/SectionHeading';
import { Search, Eye, MessageCircle, UserPlus, ListPlus, TrendingUp, ShoppingBag, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';

const HowItWorks = () => {
  const { user, isAuthenticated } = useAuth();

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isEntrepreneur = isAuthenticated && user?.role === 'ENTREPRENEUR';

  const customerFullSteps = [
    {
      icon: <Search className="w-6 h-6 text-brand-primary" />,
      title: "1. Discover",
      description: "Browse verified local women-led micro-enterprises in your area."
    },
    {
      icon: <Eye className="w-6 h-6 text-brand-primary" />,
      title: "2. Explore Services",
      description: "View pricing, service details, and operating availability schedules."
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-brand-primary" />,
      title: "3. Add to Cart",
      description: "Select items or custom service options directly to your cart."
    },
    {
      icon: <Package className="w-6 h-6 text-brand-primary" />,
      title: "4. Place Order & Track",
      description: "Submit orders with local delivery info and track progress in real-time."
    }
  ];

  const entrepreneurFullSteps = [
    {
      icon: <UserPlus className="w-6 h-6 text-brand-primary" />,
      title: "1. Register Business Profile",
      description: "Sign up and set up your enterprise details and service location."
    },
    {
      icon: <ListPlus className="w-6 h-6 text-brand-primary" />,
      title: "2. Add Services & Hours",
      description: "List what you offer along with pricing and weekly operating schedules."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-brand-primary" />,
      title: "3. Submit for Verification",
      description: "Get verified by our team to earn the Platform Verified badge."
    },
    {
      icon: <Package className="w-6 h-6 text-brand-primary" />,
      title: "4. Receive & Manage Orders",
      description: "Accept customer requests, update order status, and grow your income."
    }
  ];

  const guestCustomerSteps = [
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

  const guestEntrepreneurSteps = [
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
        <SectionHeading title="How It Works" />

        {isCustomer ? (
          /* CUSTOMER ONLY WORKFLOW */
          <div className="bg-brand-surface rounded-2xl p-8 sm:p-10 border border-brand-border shadow-sm max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-brand-secondary mb-2 text-center">Customer Ordering Experience</h3>
            <p className="text-center text-brand-text mb-8">Four simple steps to order from local women entrepreneurs.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customerFullSteps.map((step, index) => (
                <div key={index} className="bg-brand-background border border-brand-border rounded-xl p-5 flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-secondary mb-1">{step.title}</h4>
                    <p className="text-xs text-brand-text leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center flex flex-wrap justify-center gap-4">
              <Link to="/businesses">
                <Button variant="primary" size="lg">Explore Local Businesses</Button>
              </Link>
              <Link to="/orders">
                <Button variant="outline" size="lg">View My Orders</Button>
              </Link>
            </div>
          </div>
        ) : isEntrepreneur ? (
          /* ENTREPRENEUR ONLY WORKFLOW */
          <div className="bg-brand-surface rounded-2xl p-8 sm:p-10 border border-brand-primary/20 shadow-sm max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-brand-primary mb-2 text-center">Entrepreneur Business Workflow</h3>
            <p className="text-center text-brand-text mb-8">Manage, verify, and receive orders for your home business.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {entrepreneurFullSteps.map((step, index) => (
                <div key={index} className="bg-brand-background border border-brand-border rounded-xl p-5 flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-secondary mb-1">{step.title}</h4>
                    <p className="text-xs text-brand-text leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center flex flex-wrap justify-center gap-4">
              <Link to="/entrepreneur/dashboard">
                <Button variant="primary" size="lg">Go to Business Dashboard</Button>
              </Link>
              <Link to="/learning">
                <Button variant="outline" size="lg">View Business Guides</Button>
              </Link>
            </div>
          </div>
        ) : (
          /* GUEST / ADMIN DUAL WORKFLOW */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
            {/* Customer Path */}
            <div className="bg-brand-surface rounded-2xl p-8 border border-brand-border shadow-sm">
              <h3 className="text-2xl font-bold text-brand-secondary mb-8 text-center">For Customers</h3>
              <div className="space-y-8 relative">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-brand-border -z-10"></div>
                {guestCustomerSteps.map((step, index) => (
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
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-brand-primary/20 -z-10"></div>
                {guestEntrepreneurSteps.map((step, index) => (
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
        )}
      </div>
    </section>
  );
};

export default HowItWorks;
