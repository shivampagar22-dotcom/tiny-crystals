"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import ToastContainer from "@/components/Toast";
import { ArrowRight, Star, Heart, Award, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/currency";

export default function HomePage() {
  const { products } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter 4 best-sellers
  const bestSellers = products.slice(0, 4);

  // Instagram items
  const instagramPhotos = [
    { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop", likes: "1.2k" },
    { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop", likes: "982" },
    { url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=400&auto=format&fit=crop", likes: "2.1k" },
    { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop", likes: "842" },
    { url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=400&auto=format&fit=crop", likes: "1.5k" },
    { url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=400&auto=format&fit=crop", likes: "1.1k" },
  ];

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main className="flex-1">
        
        {/* 1. Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-sand-light/30">
          
          {/* Subtle background texture circles */}
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-creme/30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-dusty-pink/20 blur-3xl pointer-events-none" />

          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Hero text */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-xs font-sans tracking-[0.3em] uppercase text-maroon font-bold bg-maroon/5 px-4 py-2 rounded-full">
                  Crafted Bead by Bead
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-850 leading-[1.1] font-medium"
              >
                Luxurious Beaded <br />
                <span className="text-maroon italic">Artistry</span> for the Soul.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed"
              >
                Tiny Crystals blends meticulous slow-fashion beadwork with freshwater pearls and 14k gold-filled hardware. Discover an exquisite statement of organic elegance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2"
              >
                <Link
                  href="/shop"
                  className="bg-maroon hover:bg-maroon-light text-white font-sans font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-xl transition-all shadow-premium flex items-center gap-2 group"
                >
                  Shop Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/shop?category=Custom%20Jewelry"
                  className="border border-maroon text-maroon hover:bg-maroon hover:text-white font-sans font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-xl transition-all"
                >
                  Custom Orders
                </Link>
              </motion.div>
            </div>

            {/* Hero image card - Luxury design resembling reference */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-6 flex justify-center"
            >
              <div className="relative w-full max-w-[480px]">
                {/* Background decorative sand card */}
                <div className="absolute inset-0 bg-sand rounded-[32px] transform rotate-3 scale-95" />
                
                {/* Foreground Card */}
                <div className="relative bg-card-bg rounded-[32px] p-4 shadow-2xl border border-sand/30 overflow-hidden">
                  <div className="aspect-[4/5] rounded-[24px] overflow-hidden bg-sand-light relative group">
                    <img
                      src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
                      alt="Premium Beaded Jewelry Banner"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Inner banner glass tag */}
                    <div className="absolute bottom-6 left-6 right-6 glass p-4 rounded-2xl border border-white/20">
                      <p className="text-[10px] tracking-widest uppercase text-stone-400 font-bold font-sans">Artisan Drop</p>
                      <h3 className="font-serif text-lg font-semibold text-stone-850 dark:text-stone-100">Freshwater Pearl Monograms</h3>
                      <p className="text-[11px] font-sans text-stone-500 mt-1">Starting from {formatCurrency(2499)}. Limited stock available.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* 2. Brand Values/Features banner */}
        <section className="py-12 bg-maroon text-creme-light dark:bg-maroon-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <Award className="w-6 h-6 text-gold" />
              <h4 className="text-xs tracking-wider uppercase font-semibold font-sans">Artisan Handmade</h4>
              <p className="text-[10px] text-creme/60 font-sans">Every bead hand-woven</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <ShieldCheck className="w-6 h-6 text-gold" />
              <h4 className="text-xs tracking-wider uppercase font-semibold font-sans">14k Gold Hardware</h4>
              <p className="text-[10px] text-creme/60 font-sans">Gold-filled & durable build</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck className="w-6 h-6 text-gold" />
              <h4 className="text-xs tracking-wider uppercase font-semibold font-sans">Global Shipping</h4>
              <p className="text-[10px] text-creme/60 font-sans">Secure courier delivery</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-gold" />
              <h4 className="text-xs tracking-wider uppercase font-semibold font-sans">Custom Jewelry</h4>
              <p className="text-[10px] text-creme/60 font-sans">Bespoke monogram sizing</p>
            </div>
          </div>
        </section>

        {/* 3. Featured Collections */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
              Curated Styles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-850 font-medium">
              Explore Collections
            </h2>
            <div className="w-12 h-0.5 bg-maroon mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Necklaces", count: "12 Items", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop" },
              { name: "Bracelets", count: "8 Items", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=300&auto=format&fit=crop" },
              { name: "Earrings", count: "9 Items", img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=300&auto=format&fit=crop" },
              { name: "Rings", count: "15 Items", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop" },
              { name: "Custom Jewelry", count: "Made to order", img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=300&auto=format&fit=crop" }
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={`/shop?category=${encodeURIComponent(cat.href || cat.name)}`}
                className="group relative h-72 rounded-[24px] overflow-hidden shadow-premium border border-sand/15 block"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent flex flex-col justify-end p-5">
                  <h3 className="font-serif text-base sm:text-lg text-white font-medium">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] font-sans text-stone-300 mt-0.5">
                    {cat.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Best Selling Products */}
        <section className="py-20 bg-sand-light/20 border-t border-b border-sand/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
                  Artisans Favourites
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-stone-850 font-medium">
                  Best-Selling Pieces
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-sans font-bold tracking-widest uppercase text-maroon dark:text-gold border-b border-maroon/30 hover:border-maroon pb-1 transition-all"
              >
                View Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 5. Handmade Craftsmanship Spotlight */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
            <div className="relative max-w-lg w-full">
              {/* Back border effect */}
              <div className="absolute inset-4 border border-maroon/20 rounded-[32px] translate-x-4 translate-y-4" />
              
              {/* Image with rounded corner like mockup */}
              <div className="relative rounded-[32px] overflow-hidden shadow-xl aspect-video sm:aspect-square bg-sand">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop"
                  alt="Beading artisan hands weaving pearls"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
              Slow Fashion Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-850 leading-tight font-medium">
              A Quiet Meditation in Every Bead
            </h2>
            <div className="w-12 h-0.5 bg-maroon" />
            <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
              At Tiny Crystals, jewelry is not manufactured; it is woven. Under the slow-fashion ethos, each piece requires hours of meticulous hand-beading. We use premium Japanese Miyuki delica seed beads, natural freshwater baroque pearls, and semi-precious quartz stones, bound with durable silk thread and finished with 14k gold-filled metals that resist tarnishing.
            </p>
            <blockquote className="border-l-2 border-maroon pl-4 italic text-sm text-maroon font-serif leading-relaxed">
              Every bead is a stitch in time, a slow meditation of structure and color. We do not chase fast trends; we capture organic elegance in micro-art. <br />
              <span className="block mt-2 text-xs font-sans not-italic text-stone-500 font-bold uppercase tracking-wider">— Ganga, Head Artisan</span>
            </blockquote>
            <div className="pt-2">
              <Link
                href="/about"
                className="bg-maroon hover:bg-maroon-light text-white font-sans font-bold text-xs tracking-widest uppercase px-6 py-3.5 rounded-xl transition-all shadow-premium inline-block"
              >
                Our Story
              </Link>
            </div>
          </div>

        </section>

        {/* 6. Customer Testimonials */}
        <section className="py-20 bg-creme-light dark:bg-stone-900 border-t border-b border-sand/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-12">
              <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
                Loved by customers
              </span>
              <h2 className="font-serif text-3xl text-stone-850 font-medium">
                Testimonials
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Sophia L.", city: "Mumbai", review: "The seed bead choker is absolutely breathtaking. It has a beautiful weight to it and the pearls feel so smooth. It's my go-to piece!", rating: 5 },
                { name: "Elena R.", city: "Bangalore", review: "I am in love with my drop earrings. Ganga’s attention to detail is outstanding. The shipping was fast and the packaging felt like opening a luxury gift.", rating: 5 },
                { name: "Isabella V.", city: "London", review: "I commissioned a custom monogram necklace and the design process was so collaborative. Ganga sent me updates at every step. Truly a masterpiece.", rating: 5 }
              ].map((test, idx) => (
                <div key={idx} className="bg-white/50 dark:bg-stone-950/40 p-8 rounded-[24px] border border-sand/10 shadow-premium flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex text-amber-500 gap-1">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 font-sans italic leading-relaxed">
                      {test.review}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-sand/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-sans font-bold text-stone-800 dark:text-stone-200">{test.name}</h4>
                      <p className="text-[10px] text-stone-400 font-sans">{test.city}</p>
                    </div>
                    <Heart className="w-4 h-4 text-maroon fill-maroon/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Instagram Gallery */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
              @tiny.crystals_
            </span>
            <h2 className="font-serif text-3xl text-stone-850 font-medium">
              Follow Our Journey
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {instagramPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-sand/10 cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt="Beaded jewelry display"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-maroon/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xs font-sans font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" /> {photo.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />

      {/* Quick View Modal Overlay */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
