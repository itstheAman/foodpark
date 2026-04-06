import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, Globe, Sparkles } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-light px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 text-brand-red rounded-full text-xs font-black uppercase tracking-widest border border-red-100 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Get in Touch</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-sans font-black text-brand-dark tracking-tight"
          >
            Visit Our <span className="text-brand-red">Foodpark Oasis</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Have a question, feedback, or just want to say hello? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50 space-y-10 text-center sm:text-left"
            >
              <h2 className="text-3xl font-sans font-black text-brand-dark leading-tight">Contact Info</h2>
              
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="p-4 bg-red-50 rounded-2xl text-brand-red">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-brand-dark font-sans font-black text-xl">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="p-4 bg-red-50 rounded-2xl text-brand-red">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Email</p>
                    <p className="text-brand-dark font-sans font-black text-xl">hello@foody.com</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="p-4 bg-red-50 rounded-2xl text-brand-red">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Location</p>
                    <p className="text-brand-dark font-sans font-black text-xl leading-tight">123 Foodie Street, Gourmet City</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="p-4 bg-red-50 rounded-2xl text-brand-red">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Opening Hours</p>
                    <p className="text-brand-dark font-sans font-black text-lg leading-tight">Mon - Fri: 9AM - 10PM</p>
                    <p className="text-brand-dark font-sans font-black text-lg leading-tight">Sat - Sun: 10AM - 11PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-gray-50 flex justify-center sm:justify-start gap-4">
                <a href="#" className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-brand-red hover:text-white transition-all border border-gray-100">
                  <Globe className="w-6 h-6" />
                </a>
                <a href="#" className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-brand-red hover:text-white transition-all border border-gray-100">
                  <MessageSquare className="w-6 h-6" />
                </a>
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <div className="h-72 bg-brand-dark rounded-[3rem] overflow-hidden relative shadow-2xl shadow-gray-900/10 group">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000"
                alt="Map"
                className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border-4 border-gray-50">
                  <MapPin className="w-8 h-8 text-brand-red" />
                  <span className="font-black text-brand-dark uppercase tracking-widest text-xs">Find us here</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-900/5 border border-gray-50"
            >
              <h2 className="text-4xl font-sans font-black text-brand-dark mb-10 text-center md:text-left">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Your Name</label>
                    <input
                      required
                      type="text"
                      value={formState.name}
                      onChange={e => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all font-medium text-brand-dark"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formState.email}
                      onChange={e => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all font-medium text-brand-dark"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Subject</label>
                  <input
                    required
                    type="text"
                    value={formState.subject}
                    onChange={e => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all font-medium text-brand-dark"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Message</label>
                  <textarea
                    required
                    value={formState.message}
                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all h-56 resize-none font-medium text-brand-dark"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-6 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-red transition-all shadow-2xl shadow-gray-900/20 flex items-center justify-center gap-4 group"
                >
                  {submitted ? (
                    <>
                      <Send className="w-6 h-6 animate-bounce" />
                      Message Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
