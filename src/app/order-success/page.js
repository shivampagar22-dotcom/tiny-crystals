"use client";

import React, { useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, ShoppingBag, MapPin, CreditCard, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { formatCurrency } from "@/lib/currency";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders } = useShop();

  const orderId = searchParams.get("orderId");
  const order = useMemo(
    () => orders.find((o) => o.id === orderId) || null,
    [orderId, orders]
  );

  useEffect(() => {
    if (order) {
        // Trigger premium double confetti blast
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 100 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 40 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-sand-light/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
        <p className="text-xs font-sans text-stone-500 mt-4">Retrieving order details...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-card-bg rounded-[32px] p-8 sm:p-12 border border-sand/20 shadow-premium text-center space-y-8"
      >
        
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100/50">
          <Check className="w-8 h-8" />
        </div>

        {/* Text Headers */}
        <div className="space-y-2">
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-emerald-600 font-bold block">
            Payment Confirmed
          </span>
          <h1 className="font-serif text-3xl text-stone-850 dark:text-stone-100 font-medium">
            Thank You for Your Order
          </h1>
          <p className="text-xs text-stone-500 font-sans">
            Your artisanal hand-beaded jewelry is officially in line for creation.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="bg-sand-light/50 dark:bg-stone-900/50 p-6 rounded-2xl border border-sand/10 text-left space-y-4 font-sans text-xs">
          
          <div className="flex justify-between items-center border-b border-sand/15 pb-3">
            <span className="text-stone-400">Order Reference</span>
            <strong className="text-stone-800 dark:text-stone-200 uppercase font-mono">#{order.id}</strong>
          </div>

          <div className="flex gap-3 items-start">
            <MapPin className="w-4 h-4 text-maroon flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-800 dark:text-stone-250">Delivery Address</p>
              <p className="text-stone-500 leading-relaxed mt-0.5">
                {order.customer.name} <br />
                {order.customer.address}, {order.customer.city} <br />
                {order.customer.postal} | Phone: {order.customer.phone}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start border-t border-sand/15 pt-3">
            <CreditCard className="w-4 h-4 text-maroon flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-800 dark:text-stone-250">Payment Confirmation</p>
              <p className="text-stone-500 leading-relaxed mt-0.5">
                Method: {order.paymentMethod} <br />
                Transaction ID: <span className="font-mono text-[10px]">{order.paymentId}</span>
              </p>
            </div>
          </div>

          <div className="border-t border-sand/15 pt-3 flex justify-between items-center text-sm font-bold text-stone-850 dark:text-stone-100">
            <span>Total Charged</span>
            <span className="font-serif text-base text-maroon dark:text-gold">{formatCurrency(order.total)}</span>
          </div>

        </div>

        {/* Action Button CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link
            href="/shop"
            className="flex-1 bg-maroon hover:bg-maroon-light text-white dark:bg-gold dark:text-maroon font-sans font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all shadow-premium flex items-center justify-center gap-2 group"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 border border-sand hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-650 dark:text-stone-300 font-sans font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            Go to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </motion.div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-sand-light/30">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
