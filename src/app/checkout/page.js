"use client";

import React, { useState, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";
import { CreditCard, ShoppingBag, ShieldCheck, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/currency";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getSubtotal, getDiscountAmount, getTotal, checkoutOrder, triggerToast } = useShop();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.replace("/cart");
    }
  }, [cart, router]);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal: "",
  });

  // Simulator modal state
  const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [simulatedCard, setSimulatedCard] = useState({ number: "4111 2222 3333 4444", expiry: "12/28", cvv: "123" });
  const simulatedOrderId = useId().replace(/:/g, "").toUpperCase();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    const { name, email, phone, address, city, postal } = formData;
    if (!name || !email || !phone || !address || !city || !postal) {
      triggerToast("Please fill in all shipping details.", "error");
      return;
    }

    // Check if Razorpay keys are configured (mocked for now, opens simulator)
    // If we want a production script loading:
    const hasRazorpayKeys = false; // process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (hasRazorpayKeys) {
      // In live production, we'd trigger Razorpay standard window overlay here.
      triggerToast("Initializing Razorpay Gateway...", "info");
    } else {
      // Open our premium custom Razorpay simulator overlay
      setShowPaymentSimulator(true);
    }
  };

  const handleSimulatedPayment = () => {
    setPaymentLoading(true);
    
    setTimeout(async () => {
      setPaymentLoading(false);
      setShowPaymentSimulator(false);
      
      // Place order and clear cart
      const mockPayId = "pay_mock_" + Math.random().toString(36).substr(2, 9).toUpperCase();
      const placedOrder = await checkoutOrder(formData, mockPayId);
      
      // Redirect to success
      router.push(`/order-success?orderId=${placedOrder.id}`);
    }, 2000);
  };

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  if (cart.length === 0) return null;

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Link */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1 text-xs font-sans font-bold text-stone-500 hover:text-maroon transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Shipping Form */}
          <div className="lg:col-span-7 bg-card-bg rounded-[28px] p-6 sm:p-8 border border-sand/20 shadow-premium">
            <h2 className="font-serif text-2xl text-stone-850 dark:text-stone-150 font-medium mb-6">
              Shipping & Delivery Details
            </h2>

            <form onSubmit={handlePlaceOrderSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g. Jane Doe"
                    className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="E.g. +91 98765 43210"
                    className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="E.g. jane@example.com"
                  className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Delivery Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street, suite, building details"
                  className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="E.g. Mumbai"
                    className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Postal / Zip Code</label>
                  <input
                    type="text"
                    name="postal"
                    required
                    value={formData.postal}
                    onChange={handleInputChange}
                    placeholder="E.g. 400001"
                    className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                  />
                </div>
              </div>

              {/* Secure note */}
              <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-900/40 p-4 rounded-xl text-stone-500 font-sans text-xs border border-sand/10">
                <Lock className="w-4 h-4 text-maroon flex-shrink-0" />
                <span>Your information is encrypted and transmitted securely.</span>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                className="w-full bg-maroon hover:bg-maroon-light text-white dark:bg-gold dark:text-maroon font-sans font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all shadow-premium flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Payment
              </button>

            </form>
          </div>

          {/* RIGHT: Order review and breakdown */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-card-bg rounded-[28px] p-6 border border-sand/20 shadow-premium space-y-6">
              <h3 className="font-serif text-lg text-stone-850 dark:text-stone-150 font-semibold border-b border-sand/15 pb-4">
                Review Items ({cart.length})
              </h3>

              {/* Mini Item grid */}
              <div className="divide-y divide-sand/10 max-h-60 overflow-y-auto pr-2 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2.5 first:pt-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-sand-light/50 flex-shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-product text-xs text-stone-850 dark:text-stone-150 font-semibold line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-sans">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-serif text-xs font-semibold text-stone-700 dark:text-stone-300">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-sand/15 pt-6 space-y-3 font-sans text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-serif font-semibold text-stone-850 dark:text-stone-100">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Applied</span>
                    <span className="font-serif">-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">Complimentary</span>
                </div>

                <div className="border-t border-sand/15 pt-4 flex justify-between text-sm font-bold text-stone-850 dark:text-stone-100">
                  <span>Total Due</span>
                  <span className="font-serif text-base text-maroon dark:text-gold">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Badges details */}
              <div className="flex gap-4 justify-around text-[10px] text-stone-400 font-sans pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure checkout
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" /> Complimentary delivery
                </span>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />

      {/* RAZORPAY PAYMENT SIMULATOR MODAL OVERLAY */}
      <AnimatePresence>
        {showPaymentSimulator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            />

            {/* Razorpay Interface Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-950 text-white w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl relative border border-stone-800 z-10"
            >
              {/* Header */}
              <div className="bg-indigo-900/40 p-5 border-b border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-indigo-400 font-bold block">
                    Razorpay Gateway
                  </span>
                  <h3 className="font-sans text-sm font-bold tracking-wide">
                    Tiny Crystals Checkout
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-stone-400 font-sans">Amount</p>
                  <p className="font-mono text-xs font-bold text-emerald-400">{formatCurrency(total)}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 text-[11px] font-sans space-y-1">
                  <p className="text-stone-400">Order ID: <strong className="text-stone-200">#ORD-{simulatedOrderId}</strong></p>
                  <p className="text-stone-400">Customer: <strong className="text-stone-200">{formData.name}</strong></p>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-400 uppercase tracking-widest">Card Number</label>
                    <input
                      type="text"
                      disabled
                      value={simulatedCard.number}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4.5 py-2.5 text-xs text-stone-300 text-center font-mono cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 uppercase tracking-widest">Expiry</label>
                      <input
                        type="text"
                        disabled
                        value={simulatedCard.expiry}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-300 text-center font-mono cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 uppercase tracking-widest">CVV</label>
                      <input
                        type="password"
                        disabled
                        value={simulatedCard.cvv}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-300 text-center font-mono cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-stone-400 font-sans text-center">
                  🔒 Verified by Razorpay Secure Sandbox. Click below to mock successful payment.
                </div>
              </div>

              {/* Footer Button */}
              <div className="p-6 bg-stone-900/60 border-t border-stone-850 flex gap-3">
                <button
                  onClick={() => setShowPaymentSimulator(false)}
                  disabled={paymentLoading}
                  className="flex-1 border border-stone-800 hover:bg-stone-900 text-stone-400 hover:text-white rounded-xl py-3 text-xs font-sans tracking-widest uppercase transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSimulatedPayment}
                  disabled={paymentLoading}
                  className="flex-1 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl py-3 text-xs font-sans font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Paying...
                    </>
                  ) : (
                    "Authorize"
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
