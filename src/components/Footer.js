"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const { triggerToast } = useShop();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      triggerToast("Thank you! You have subscribed to the Tiny Crystals newsletter.");
      setEmail("");
    }
  };

  return (
    <footer className="bg-maroon text-creme-light dark:bg-maroon-dark pt-16 pb-8 border-t border-maroon/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Signature */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 overflow-hidden rounded-full border border-gold/30 bg-white p-0.5 shadow-md">
                <img
                  src="/logo.png"
                  alt="Tiny Crystals Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-lg tracking-[0.2em] uppercase text-gold font-bold leading-tight">
                  Tiny Crystals
                </span>
                <span className="block font-sans text-[0.55rem] tracking-[0.3em] uppercase text-creme/50">
                  Beaded Jewellery
                </span>
              </div>
            </div>
            <p className="font-sans text-xs text-creme/70 leading-relaxed max-w-sm">
              Artisanal hand-beaded luxury jewelry by Ganga Sachin Kalyani, blending natural pearls, stones, and high-end materials.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* Instagram */}
              <a href="https://www.instagram.com/tiny.crystals_" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="hover:text-gold transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="hover:text-gold transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold font-semibold">
              Collections
            </h4>
            <ul className="space-y-2 text-xs font-sans text-creme/70">
              <li>
                <Link href="/shop?category=Necklaces" className="hover:text-gold transition-colors">Necklaces</Link>
              </li>
              <li>
                <Link href="/shop?category=Bracelets" className="hover:text-gold transition-colors">Bracelets</Link>
              </li>
              <li>
                <Link href="/shop?category=Earrings" className="hover:text-gold transition-colors">Earrings</Link>
              </li>
              <li>
                <Link href="/shop?category=Rings" className="hover:text-gold transition-colors">Rings</Link>
              </li>
              <li>
                <Link href="/shop?category=Custom%20Jewelry" className="hover:text-gold transition-colors">Custom Designs</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold font-semibold">
              Atelier Info
            </h4>
            <ul className="space-y-3 text-xs font-sans text-creme/70">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Bali mandir, Panchavati, Nashik</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+91 95279 41185</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>gangak727@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold font-semibold">
              Newsletter
            </h4>
            <p className="font-sans text-xs text-creme/70 leading-relaxed">
              Subscribe to receive updates on limited drop collections and behind-the-scenes stories.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-maroon-dark/60 border border-gold/30 rounded-xl px-4 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-gold text-creme-light"
              />
              <button
                type="submit"
                className="bg-gold hover:bg-gold/80 text-maroon font-sans font-bold text-xs tracking-widest uppercase py-2.5 rounded-xl transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Legal / copyright */}
        <div className="border-t border-creme/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-sans text-creme/50 gap-4">
          <p>© {new Date().getFullYear()} Tiny Crystals Jewelry. All Rights Reserved. Crafted with love & beads.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gold transition-colors">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
