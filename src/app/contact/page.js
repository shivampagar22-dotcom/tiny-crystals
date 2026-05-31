"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";
import { Mail, Phone, MapPin, Clock, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const { triggerToast } = useShop();

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      triggerToast("Message sent successfully! We will get back to you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Banner/Header */}
        <section className="text-center space-y-2 mb-16">
          <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-850 dark:text-stone-100 font-medium">
            Contact Us
          </h1>
          <div className="w-12 h-0.5 bg-maroon mx-auto mt-4" />
          <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
            Have questions about a customized piece, custom sizing, or shipping? Reach out to us.
          </p>
        </section>

        {/* Contact Split Columns */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Contact Form Card */}
          <div className="lg:col-span-7 bg-card-bg rounded-[28px] p-6 sm:p-8 border border-sand/20 shadow-premium relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="font-serif text-xl text-stone-850 dark:text-stone-150 font-semibold">
                    Send Us a Message
                  </h2>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-500">Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          className="w-full bg-white dark:bg-stone-900 border border-sand/35 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-500">Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your email address"
                          className="w-full bg-white dark:bg-stone-900 border border-sand/35 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-500">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What are you writing about?"
                        className="w-full bg-white dark:bg-stone-900 border border-sand/35 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-500">Message</label>
                      <textarea
                        name="message"
                        required
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Write your detailed inquiry here..."
                        className="w-full bg-white dark:bg-stone-900 border border-sand/35 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-maroon hover:bg-maroon-light text-white dark:bg-gold dark:text-maroon font-sans font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all shadow-premium flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send Inquiry
                        </>
                      )}
                    </button>

                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-semibold text-stone-850 dark:text-stone-150">Inquiry Received</h3>
                    <p className="text-xs text-stone-500 font-sans max-w-xs mx-auto">
                      Thank you for contacting Tiny Crystals. Your message has been sent directly to Ganga Sachin Kalyani.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="border border-sand hover:bg-stone-50 text-stone-650 font-sans font-bold text-xs tracking-widest uppercase px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Contact Details & Info Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-card-bg rounded-[28px] p-6 sm:p-8 border border-sand/20 shadow-premium space-y-6">
              <h2 className="font-serif text-xl text-stone-850 dark:text-stone-150 font-semibold border-b border-sand/15 pb-4">
                Contact Information
              </h2>

              <ul className="space-y-4 font-sans text-xs">
                
                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-sand-light/50 text-maroon flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-250">Address</h4>
                    <p className="text-stone-500 mt-0.5">Bali mandir, Panchavati, Nashik</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-sand-light/50 text-maroon flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-250">Phone Inquiry</h4>
                    <p className="text-stone-500 mt-0.5">+91 95279 41185</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-sand-light/50 text-maroon flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-250">Email Address</h4>
                    <p className="text-stone-500 mt-0.5">gangak727@gmail.com</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-sand-light/50 text-maroon flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-250">Atelier Hours</h4>
                    <p className="text-stone-500 mt-0.5">Monday to Saturday: 10:00 AM – 6:00 PM IST</p>
                  </div>
                </li>

              </ul>
            </div>

            {/* Simulated Map Graphic Container */}
            <div className="bg-sand rounded-[28px] aspect-[4/3] overflow-hidden relative shadow-premium border border-sand/20">
              <img
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop"
                alt="Tiny Crystals atelier preview"
                className="w-full h-full object-cover opacity-30 grayscale saturate-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-maroon text-white flex items-center justify-center animate-bounce shadow-md">
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
                <h4 className="font-serif text-sm font-semibold text-stone-850 dark:text-stone-100">Ganga Sachin Kalyani</h4>
                <p className="text-[10px] font-sans text-stone-600 max-w-xs leading-relaxed">
                  Tiny Crystals, Bali mandir, Panchavati, Nashik.
                </p>
              </div>
            </div>

          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}
