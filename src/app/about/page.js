"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";
import { Sparkles, Eye, Award, Hourglass } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const steps = [
    {
      title: "1. The Design Blueprint",
      icon: <Eye className="w-5 h-5 text-gold" />,
      desc: "Each item begins with a geometric pattern hand-sketched on grid paper, mapping bead intersections and color gradients."
    },
    {
      title: "2. Sourcing Premium Elements",
      icon: <Sparkles className="w-5 h-5 text-gold" />,
      desc: "We select Japanese Miyuki seed beads for consistency, combined with natural freshwater baroque pearls and 14k gold metals."
    },
    {
      title: "3. The Hand-Weaving Meditation",
      icon: <Hourglass className="w-5 h-5 text-gold" />,
      desc: "Artisan Ganga hand-threads each bead using a single-needle thread technique, requiring hours of quiet patience."
    },
    {
      title: "4. Luxury Finishing",
      icon: <Award className="w-5 h-5 text-gold" />,
      desc: "We fasten clasps using reinforced knots, testing tension, and placing items in linen pouches with protective boxes."
    }
  ];

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
              Behind the Beads
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-850 dark:text-stone-100 leading-tight font-medium">
              We Craft Stories, <br />
              <span className="text-maroon italic">Bead by Bead</span>.
            </h1>
            <div className="w-12 h-0.5 bg-maroon" />
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
              Tiny Crystals was founded in the summer of 2021 by bead artisan Ganga, with the core philosophy of elevating micro-beadwork into luxury jewelry. Disillusioned by the rapid pace of fast fashion, Ganga sought to capture the elegance of organic elements and slow manufacturing.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
              Our signature style relies on Japanese Miyuki Delica glass beads—world-renowned for their micro-precision shape and high-shine finishes. We weave these tiny glass tubes together with silk thread, merging them with irregular freshwater baroque pearls. The result is a gorgeous, tactile piece of art that rests gracefully against the body.
            </p>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative max-w-lg w-full">
              <div className="absolute inset-4 border border-maroon/20 rounded-[32px] translate-x-4 translate-y-4" />
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-[4/5] bg-sand">
                <img
                  src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop"
                  alt="Tiny Crystals seed beads craftsmanship detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </section>

        {/* Process Section */}
        <section className="mt-28 py-20 bg-sand-light/20 rounded-[40px] border border-sand/15 p-8 sm:p-12">
          <div className="text-center space-y-2 mb-16">
            <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
              Atelier Workflow
            </span>
            <h2 className="font-serif text-3xl text-stone-850 dark:text-stone-100 font-medium">
              The Art of Slow Beading
            </h2>
            <div className="w-12 h-0.5 bg-maroon mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card-bg p-6 rounded-2xl border border-sand/10 shadow-sm flex flex-col justify-between h-56"
              >
                <div className="w-10 h-10 rounded-full bg-sand-light flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-stone-800 dark:text-stone-200 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quality Section */}
        <section className="mt-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <div className="relative max-w-lg w-full">
              <div className="absolute inset-4 border border-maroon/20 rounded-[32px] -translate-x-4 translate-y-4" />
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-[4/5] bg-sand">
                <img
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop"
                  alt="Freshwater baroque pearl detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
              Unrivaled Quality
            </span>
            <h2 className="font-serif text-3xl text-stone-850 dark:text-stone-100 font-medium">
              Hand-Selected Materials
            </h2>
            <div className="w-12 h-0.5 bg-maroon" />
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
              We believe a handmade piece should last a lifetime. That’s why we refuse to use cheap plastic beads or base metals that turn green. We source natural freshwater pearls, hand-sorting them to ensure matching sizes and unique baroque characters.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
              All metal loops, spring rings, and extension chains are 14k gold-filled. Gold-filled metals contain a thick layer of gold pressure-bonded to a core metal, offering the longevity and tarnish-resistance of solid gold at a fraction of the cost.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="bg-maroon hover:bg-maroon-light text-white dark:bg-gold dark:text-maroon font-sans font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-xl transition-all shadow-premium"
              >
                Browse Creations
              </Link>
            </div>
          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
