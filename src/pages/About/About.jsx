import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Users, Sparkles, ChevronDown, ChevronUp, ArrowRight, Award, MapPin, Target } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const FAQS = [
  {
    question: "What is Aatmanirbhar Nari?",
    answer: "Aatmanirbhar Nari is a dedicated digital platform created to connect local women micro-entrepreneurs—home cooks, tailors, beauticians, and artisans—with neighbors and buyers in Hubli-Dharwad and surrounding regions."
  },
  {
    question: "Is there any fee or commission charged to entrepreneurs?",
    answer: "No. Listing on Aatmanirbhar Nari is 100% free for women entrepreneurs. Customers connect directly with the entrepreneur via WhatsApp or phone call without middleman fees."
  },
  {
    question: "How are businesses on the platform verified?",
    answer: "Each business profile is reviewed to ensure authentic local operations, active service availability, and clear contact details before being featured in our directory."
  },
  {
    question: "How can I register my home business?",
    answer: "Click on 'Register Business' in the menu, fill in your business name, craft category, location, and service list. Your listing will go live after quick verification."
  },
  {
    question: "Can I order tiffins or custom outfits for events?",
    answer: "Yes! Simply browse through our categories, view individual service menus and price ranges, and tap the WhatsApp or Phone inquiry button to place direct orders."
  }
];

const About = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const { user, isAuthenticated } = useAuth();

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isEntrepreneur = isAuthenticated && user?.role === 'ENTREPRENEUR';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const getCtaContent = () => {
    if (isCustomer) {
      return {
        heading: 'Discover & Support Local Businesses',
        subtext: 'Connect directly with skilled women entrepreneurs in your community and support local micro-enterprises.',
        primaryText: 'Explore Local Businesses',
        primaryLink: '/businesses',
        secondaryText: 'My Orders',
        secondaryLink: '/orders',
      };
    }
    if (isEntrepreneur) {
      return {
        heading: 'Grow Your Business with Aatmanirbhar Nari',
        subtext: 'Manage your business profile, service offerings, operating schedules, and incoming customer orders.',
        primaryText: 'My Business',
        primaryLink: '/entrepreneur/dashboard?tab=details',
        secondaryText: 'Manage Orders',
        secondaryLink: '/entrepreneur/dashboard?tab=orders',
      };
    }
    if (isAdmin) {
      return {
        heading: 'Manage Aatmanirbhar Nari',
        subtext: 'Oversee community verification requests, platform metrics, and user management.',
        primaryText: 'Admin Dashboard',
        primaryLink: '/admin/dashboard',
        secondaryText: 'Explore Businesses',
        secondaryLink: '/businesses',
      };
    }
    return {
      heading: 'Join the Movement of Empowered Women',
      subtext: 'Whether you are a customer looking for authentic home food & services, or a woman entrepreneur looking to expand your reach, Aatmanirbhar Nari is here for you.',
      primaryText: 'Register Your Business',
      primaryLink: '/auth/register',
      secondaryText: 'Explore Local Businesses',
      secondaryLink: '/businesses',
    };
  };

  const cta = getCtaContent();

  return (
    <div className="bg-brand-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center text-xs font-semibold text-brand-primary bg-brand-surface border border-brand-border px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
            <Heart className="w-3.5 h-3.5 mr-1.5 text-rose-500 fill-rose-500" />
            Our Mission & Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-secondary tracking-tight mb-6 leading-tight">
            Empowering Women Micro-Entrepreneurs
          </h1>
          <p className="text-base sm:text-lg text-brand-text leading-relaxed">
            We are building a vibrant local ecosystem that gives home-based women creators the digital presence, visibility, and economic independence they deserve.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {[
            { label: 'Verified Entrepreneurs', value: '50+', icon: Users },
            { label: 'Craft & Service Domains', value: '4 Main', icon: Target },
            { label: 'Platform Commission', value: '0%', icon: ShieldCheck },
            { label: 'Primary Focus Region', value: 'Hubli-Dharwad', icon: MapPin },
          ].map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div key={idx} className="bg-brand-surface border border-brand-border rounded-xl p-6 text-center shadow-sm">
                <div className="w-10 h-10 bg-brand-background border border-brand-border rounded-lg flex items-center justify-center mx-auto mb-3 text-brand-primary">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-secondary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-brand-muted font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Our Story & Vision (2-Column) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-8 sm:p-10 shadow-sm">
            <div className="inline-flex items-center text-xs font-bold text-brand-primary bg-brand-background px-3 py-1 rounded-md mb-4 border border-brand-border">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              The Aatmanirbhar Vision
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-secondary mb-4 leading-tight">
              Bridging the Digital Divide for Home Creators
            </h2>
            <p className="text-sm text-brand-text leading-relaxed mb-4">
              Across cities like Hubli, Dharwad, and Belagavi, thousands of talented women prepare delicious home-cooked meals, stitch designer blouses, offer herbal beauty treatments, and make handcrafted decor.
            </p>
            <p className="text-sm text-brand-text leading-relaxed">
              However, most of these micro-enterprises rely solely on word-of-mouth. Aatmanirbhar Nari gives every woman entrepreneur a verified digital storefront so local customers can discover, appreciate, and buy directly from them.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: 'Dignity & Economic Self-Reliance',
                desc: 'Enabling women to turn their everyday domestic skills into sustainable income streams on their own terms.',
                icon: Award,
              },
              {
                title: 'Hyper-Local Neighborhood Discovery',
                desc: 'Connecting consumers with authentic, hygienic home services just a few kilometers away.',
                icon: MapPin,
              },
              {
                title: 'Zero Tech Barriers',
                desc: 'Clean, simple contact interfaces that let entrepreneurs receive inquiries directly via WhatsApp.',
                icon: ShieldCheck,
              },
            ].map((pillar, idx) => {
              const IconPillar = pillar.icon;
              return (
                <div key={idx} className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm flex items-start space-x-4">
                  <div className="w-10 h-10 bg-brand-primary/10 border border-brand-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-primary mt-1">
                    <IconPillar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-brand-secondary mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-secondary mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-brand-muted">
              Everything you need to know about using or listing on Aatmanirbhar Nari.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-brand-secondary text-sm sm:text-base hover:bg-brand-background/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-brand-primary flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-brand-muted flex-shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-brand-text leading-relaxed border-t border-brand-border/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-brand-secondary via-brand-secondary/95 to-brand-primary text-white rounded-2xl p-8 sm:p-12 text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            {cta.heading}
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto mb-8 leading-relaxed">
            {cta.subtext}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to={cta.primaryLink}>
              <Button variant="primary" size="lg" className="bg-white text-brand-secondary hover:bg-brand-surface">
                {cta.primaryText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={cta.secondaryLink}>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                {cta.secondaryText}
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
