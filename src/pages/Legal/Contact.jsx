import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import SmoothInput from '../../components/common/SmoothInput';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-brand-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-xs font-bold text-[#c5a059] hover:underline mb-6">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Home Page
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Info Box */}
          <div className="bg-[#151922] border border-[#252a37] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-stone-100 mb-2">Contact Us</h1>
              <p className="text-xs text-stone-400 leading-relaxed">
                Have questions about registering your business or connecting with local women entrepreneurs? We'd love to hear from you.
              </p>
            </div>

            <div className="space-y-4 text-xs text-stone-300 pt-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#0d1015] border border-[#252a37] flex items-center justify-center text-[#c5a059] flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-100 block">Region Coverage</span>
                  <span className="text-stone-400">Hubli-Dharwad & Nearby Districts, Karnataka</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#0d1015] border border-[#252a37] flex items-center justify-center text-[#c5a059] flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-100 block">Email Support</span>
                  <span className="text-stone-400">support@aatmanirbharnari.com</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#0d1015] border border-[#252a37] flex items-center justify-center text-[#c5a059] flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-100 block">Helpline</span>
                  <span className="text-stone-400">+91 (0836) 234-5678</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#151922] border border-[#252a37] rounded-2xl p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-200">Message Sent!</h3>
                <p className="text-xs text-emerald-300/80">
                  Thank you for reaching out. Our support team will get back to you shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-stone-100 mb-2">Send Message</h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-200 mb-1">
                    Your Name *
                  </label>
                  <SmoothInput
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-[#0d1015] border border-[#252a37] rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-200 mb-1">
                    Email Address *
                  </label>
                  <SmoothInput
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#0d1015] border border-[#252a37] rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-200 mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full bg-[#0d1015] border border-[#252a37] rounded-lg p-3 text-xs text-stone-100 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full justify-center text-xs py-2.5">
                  <Send className="w-3.5 h-3.5 mr-2" />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
