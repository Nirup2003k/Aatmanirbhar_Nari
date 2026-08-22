import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, ArrowRight, CheckCircle2, Lightbulb, Sparkles, Filter } from 'lucide-react';
import Button from '../../components/common/Button';
import { learningResources } from '../../data/mockData';

const CATEGORIES = ['All', 'Business Setup', 'Pricing & Finance', 'Marketing', 'Branding', 'Legal Basics'];

const LearningHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedSteps, setCompletedSteps] = useState([1]);

  const toggleChecklistStep = (id) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredResources = useMemo(() => {
    return learningResources.filter((res) => {
      const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredResource = learningResources[0];

  return (
    <div className="bg-brand-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center text-xs font-semibold text-brand-primary bg-brand-surface border border-brand-border px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-primary" />
            Knowledge & Empowerment Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-secondary tracking-tight mb-4">
            Guides & Insights for Women Entrepreneurs
          </h1>
          <p className="text-base text-brand-text leading-relaxed">
            Practical, step-by-step guidance designed specifically for home-based caterers, tailors, beauticians, and artisans in Hubli-Dharwad.
          </p>
        </div>

        {/* Featured Banner Card */}
        {featuredResource && (
          <div className="bg-gradient-to-br from-brand-secondary via-brand-secondary/95 to-brand-primary/90 text-white rounded-2xl p-6 sm:p-10 shadow-lg mb-12 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
              <BookOpen className="w-96 h-96" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md text-amber-200 text-xs font-medium px-3 py-1 rounded-full mb-4 border border-white/10">
                <Lightbulb className="w-3.5 h-3.5 mr-1.5" />
                Featured Guide
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
                {featuredResource.title}
              </h2>
              <p className="text-brand-surface/90 text-sm sm:text-base mb-6 leading-relaxed">
                {featuredResource.summary || featuredResource.description}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to={`/learning/${featuredResource.id}`}>
                  <Button variant="primary" className="bg-white text-brand-secondary hover:bg-brand-surface shadow-md">
                    Read Full Roadmap
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <span className="text-xs text-white/80 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-amber-300" />
                  {featuredResource.readTime}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Launch Checklist Banner */}
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 mb-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-brand-border/60">
            <div>
              <h3 className="text-xl font-bold text-brand-secondary flex items-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" />
                4-Step Quick Launch Checklist
              </h3>
              <p className="text-sm text-brand-muted mt-1">
                Track your setup progress before listing your micro-business online.
              </p>
            </div>
            <div className="text-xs font-semibold text-brand-primary bg-brand-background px-3 py-1.5 rounded-lg border border-brand-border">
              {completedSteps.length} of 4 Completed
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 1, title: 'Choose Core Skill', desc: 'Define your main service or product' },
              { id: 2, title: 'Calculate Fair Pricing', desc: 'Include ingredients, labor & profit' },
              { id: 3, title: 'Prepare Sample Photos', desc: 'Snap clear pictures of your work' },
              { id: 4, title: 'List on Aatmanirbhar Nari', desc: 'Create your digital profile' }
            ].map((step) => {
              const isDone = completedSteps.includes(step.id);
              return (
                <div
                  key={step.id}
                  onClick={() => toggleChecklistStep(step.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 flex items-start space-x-3 ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-300 text-emerald-900'
                      : 'bg-brand-background border-brand-border hover:border-brand-primary/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                    isDone ? 'bg-emerald-600 text-white' : 'border border-brand-muted text-transparent'
                  }`}>
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-secondary">{step.title}</h4>
                    <p className="text-xs text-brand-muted mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  selectedCategory === cat
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                    : 'bg-brand-surface text-brand-text border-brand-border hover:border-brand-primary/40 hover:bg-brand-background'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. pricing, FSSAI)..."
              className="w-full bg-brand-surface border border-brand-border rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
        </div>

        {/* Resource Cards Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                to={`/learning/${resource.id}`}
                className="group block bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm hover:shadow-card-hover hover:border-brand-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-brand-primary bg-brand-background px-2.5 py-1 rounded-md border border-brand-border">
                      {resource.category}
                    </span>
                    <div className="flex items-center text-xs text-brand-muted font-medium bg-brand-background px-2 py-1 rounded-md border border-brand-border">
                      <Clock className="w-3 h-3 mr-1 text-brand-primary/70" />
                      {resource.readTime}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-text mb-6 line-clamp-3 leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between text-brand-primary text-xs font-semibold group-hover:underline">
                  <span>Read Detailed Guide</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center max-w-md mx-auto my-8">
            <Filter className="w-10 h-10 text-brand-muted mx-auto mb-3" />
            <h3 className="text-base font-bold text-brand-secondary mb-1">No matching guides found</h3>
            <p className="text-xs text-brand-muted mb-4">Try clearing your search query or selecting another category.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* CTA Strip */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
          <h2 className="text-2xl font-bold text-brand-secondary mb-3">
            Ready to Take Your Business Online?
          </h2>
          <p className="text-sm text-brand-text max-w-xl mx-auto mb-6 leading-relaxed">
            Join local women entrepreneurs across Hubli-Dharwad. Register your home kitchen, tailoring studio, beauty salon, or handicraft shop for free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button variant="primary" size="lg">
                Register Your Business Now
              </Button>
            </Link>
            <Link to="/businesses">
              <Button variant="outline" size="lg">
                Browse Active Directory
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LearningHub;
