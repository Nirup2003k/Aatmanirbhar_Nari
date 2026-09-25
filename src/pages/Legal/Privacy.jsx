import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="bg-brand-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-xs font-bold text-[#c5a059] hover:underline mb-6">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Home Page
        </Link>
        <div className="bg-[#151922] border border-[#252a37] rounded-2xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#252a37]">
            <ShieldCheck className="w-8 h-8 text-[#c5a059]" />
            <div>
              <h1 className="text-2xl font-extrabold text-stone-100">Privacy Policy</h1>
              <p className="text-xs text-stone-400">Last updated: September 2026</p>
            </div>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            At Aatmanirbhar Nari, we respect your privacy and are committed to protecting the personal information of our customers, local women entrepreneurs, and community members.
          </p>

          <div className="space-y-4 text-xs sm:text-sm text-stone-300">
            <div>
              <h2 className="font-bold text-stone-100 mb-1 text-base">1. Information We Collect</h2>
              <p className="leading-relaxed text-stone-400">
                We collect basic profile information (such as your name, email address, phone number, and delivery address) necessary to connect customers with local women entrepreneurs and process service orders.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-stone-100 mb-1 text-base">2. How Information is Used</h2>
              <p className="leading-relaxed text-stone-400">
                Your data is strictly used to facilitate direct business communication, order fulfillment, account authentication, and admin verification. We do not sell or rent personal data to third parties.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-stone-100 mb-1 text-base">3. Data Protection</h2>
              <p className="leading-relaxed text-stone-400">
                We implement standard security measures to protect stored information against unauthorized access, loss, or disclosure.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-stone-100 mb-1 text-base">4. Contact Us</h2>
              <p className="leading-relaxed text-stone-400">
                If you have any questions regarding our privacy practices, please reach out through our Contact page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
