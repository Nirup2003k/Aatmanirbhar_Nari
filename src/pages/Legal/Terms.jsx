import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <div className="bg-brand-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-xs font-bold text-[#c5a059] hover:underline mb-6">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Home Page
        </Link>
        <div className="bg-[#151922] border border-[#252a37] rounded-2xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#252a37]">
            <FileText className="w-8 h-8 text-[#c5a059]" />
            <div>
              <h1 className="text-2xl font-extrabold text-stone-100">Terms of Use</h1>
              <p className="text-xs text-stone-400">Last updated: September 2026</p>
            </div>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            Welcome to Aatmanirbhar Nari. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <div className="space-y-4 text-xs sm:text-sm text-stone-300">
            <div>
              <h2 className="font-bold text-stone-100 mb-1 text-base">1. Platform Purpose</h2>
              <p className="leading-relaxed text-stone-400">
                Aatmanirbhar Nari is a community platform empowering local women micro-entrepreneurs by listing their authentic home services and enabling direct connection with customers.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-stone-100 mb-1 text-base">2. User Conduct</h2>
              <p className="leading-relaxed text-stone-400">
                All users—customers and entrepreneurs—are expected to interact respectfully and provide accurate information regarding business descriptions, service pricing, and delivery addresses.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-stone-100 mb-1 text-base">3. Verification & Compliance</h2>
              <p className="leading-relaxed text-stone-400">
                Business profiles undergo platform review to support community safety. Fraudulent listings, inappropriate conduct, or misleading claims are subject to immediate removal by platform administrators.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-stone-100 mb-1 text-base">4. Direct Customer Connection</h2>
              <p className="leading-relaxed text-stone-400">
                Entrepreneurs manage their operating availability, services, and order fulfillments directly with customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
