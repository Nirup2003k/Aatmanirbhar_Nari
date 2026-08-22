import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2, CheckCircle2, BookOpen, Lightbulb, ChevronRight } from 'lucide-react';
import Button from '../../components/common/Button';
import { learningResources } from '../../data/mockData';

const LearningArticle = () => {
  const { id } = useParams();
  const article = learningResources.find((r) => r.id === Number(id)) || learningResources[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  const otherArticles = learningResources.filter((r) => r.id !== article.id).slice(0, 3);

  return (
    <div className="bg-brand-background min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/learning"
            className="inline-flex items-center text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Learning Resources
          </Link>
        </div>

        {/* Article Header Card */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-10 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-bold text-brand-primary bg-brand-background px-3 py-1 rounded-md border border-brand-border">
              {article.category}
            </span>
            <span className="text-xs text-brand-muted flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-brand-primary/70" />
              {article.readTime}
            </span>
            {article.publishedDate && (
              <span className="text-xs text-brand-muted flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-brand-primary/70" />
                {article.publishedDate}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-secondary tracking-tight mb-4 leading-tight">
            {article.title}
          </h1>

          <p className="text-base text-brand-text leading-relaxed mb-6 font-medium">
            {article.summary || article.description}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-brand-border/60">
            <div className="flex items-center space-x-2 text-xs text-brand-muted">
              <User className="w-4 h-4 text-brand-primary" />
              <span>{article.author || 'Aatmanirbhar Nari Mentorship Desk'}</span>
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center text-xs font-semibold text-brand-primary hover:text-brand-secondary bg-brand-background hover:bg-brand-surface px-3 py-1.5 rounded-lg border border-brand-border transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share Article
            </button>
          </div>
        </div>

        {/* Key Takeaways Callout Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 mb-8">
            <h3 className="text-base font-bold text-amber-900 flex items-center mb-3">
              <Lightbulb className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" />
              Key Takeaways
            </h3>
            <ul className="space-y-2">
              {article.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start text-xs sm:text-sm text-amber-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Article Sections */}
        {article.sections && article.sections.length > 0 ? (
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-10 space-y-8 mb-12 shadow-sm">
            {article.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-brand-secondary">
                  {sec.heading}
                </h2>
                <p className="text-sm text-brand-text leading-relaxed">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-10 mb-12 shadow-sm text-sm text-brand-text leading-relaxed">
            <p className="mb-4">{article.description}</p>
            <p>
              This guide provides actionable insights for home-based micro-entrepreneurs. Check back regularly for updated tools, templates, and video walkthroughs!
            </p>
          </div>
        )}

        {/* Related Articles Strip */}
        {otherArticles.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-brand-secondary mb-6 flex items-center">
              <BookOpen className="w-5 h-5 text-brand-primary mr-2" />
              More Learning Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/learning/${rel.id}`}
                  className="bg-brand-surface border border-brand-border rounded-xl p-4 shadow-sm hover:border-brand-primary/40 hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-brand-secondary line-clamp-2 mb-2">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="text-xs text-brand-primary font-medium flex items-center mt-3">
                    Read Guide
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Footer Card */}
        <div className="bg-gradient-to-r from-brand-secondary to-brand-primary text-white rounded-2xl p-8 text-center shadow-md">
          <h3 className="text-xl font-bold mb-2">Ready to Apply These Lessons?</h3>
          <p className="text-xs sm:text-sm text-white/90 max-w-lg mx-auto mb-6">
            Create your free business profile on Aatmanirbhar Nari to reach local customers in your neighborhood today.
          </p>
          <Link to="/auth/register">
            <Button variant="primary" className="bg-white text-brand-secondary hover:bg-brand-surface">
              Start Free Registration
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LearningArticle;
