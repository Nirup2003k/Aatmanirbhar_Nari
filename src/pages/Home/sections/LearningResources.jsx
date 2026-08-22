import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../../../components/common/SectionHeading';
import { learningResources } from '../../../data/mockData';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import Button from '../../../components/common/Button';

const LearningResources = () => {
  return (
    <section className="bg-brand-surface py-20 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Everything You Need to Start." 
          subtitle="Simple, actionable guidance to help you set up and grow your home business."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {learningResources.slice(0, 3).map((resource) => (
            <Link 
              key={resource.id} 
              to={`/learning/${resource.id}`}
              className="group block bg-brand-background border border-brand-border rounded-xl p-6 shadow-sm hover:shadow-card-hover hover:border-brand-primary/30 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-brand-surface w-10 h-10 rounded-lg flex items-center justify-center border border-brand-border group-hover:bg-brand-primary/5 group-hover:border-brand-primary/20 transition-colors">
                  <BookOpen className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex items-center text-xs text-brand-muted font-medium bg-brand-surface px-2 py-1 rounded-md border border-brand-border">
                  <Clock className="w-3 h-3 mr-1" />
                  {resource.readTime}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors">
                {resource.title}
              </h3>
              
              <p className="text-sm text-brand-text mb-4 flex-grow">
                {resource.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-brand-border/50 flex items-center text-brand-primary text-sm font-medium group-hover:underline">
                Read Article
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/learning">
            <Button variant="outline">
              Explore Learning Resources
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LearningResources;
