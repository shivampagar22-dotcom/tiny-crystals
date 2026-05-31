"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";
import { ShoppingBag, Trash2, Plus, Minus, Tag, Ticket, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/currency";

export default function CartPage() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    coupon, 
    applyCoupon, 
    removeCoupon,
    getSubtotal, 
    getDiscountAmount, 
    getTotal 
  } = useShop();

  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode("");
    }
  };

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl text-stone-850 dark:text-stone-100 font-medium mb-8">
          Your Shopping Cart
        </h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Cart items list */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card-bg rounded-2xl p-4 sm:p-6 border border-sand/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  {/* Thumbnail & Meta details */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-sand-light/50 flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-sans tracking-widest uppercase text-stone-400 font-semibold">
                        {item.category}
                      </span>
                      <Link href={`/product/${item.id}`} className="block">
                        <h3 className="font-product text-sm sm:text-base text-stone-850 dark:text-stone-150 hover:text-maroon transition-colors font-semibold">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-maroon dark:text-gold font-serif mt-1">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>

                  {/* Qty incrementors & Total */}
                  <div className="flex items-center justify-between sm:justify-start gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                    
                    {/* Qty Controls */}
                    <div className="flex items-center border border-sand rounded-xl px-2 py-1 bg-white/50 dark:bg-stone-900/50">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-stone-500 hover:text-maroon transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-sans text-stone-800 dark:text-stone-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-stone-500 hover:text-maroon transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="font-serif text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200 min-w-[70px] text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </motion.div>
              ))}

              {/* Tips / Info */}
              <div className="text-[11px] font-sans text-stone-400 text-center sm:text-left mt-2">
                💡 Enter code <strong className="text-maroon dark:text-gold">WELCOME10</strong> to get 10% off, or <strong className="text-maroon dark:text-gold">HANDMADE20</strong> for 20% off!
              </div>

            </div>

            {/* RIGHT: Order Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-card-bg rounded-[24px] p-6 border border-sand/20 shadow-premium space-y-6">
                <h3 className="font-serif text-lg text-stone-850 dark:text-stone-150 font-semibold border-b border-sand/15 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between text-stone-600 dark:text-stone-300">
                    <span>Subtotal</span>
                    <span className="font-serif font-semibold text-stone-850 dark:text-stone-100">{formatCurrency(subtotal)}</span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Coupon ({coupon.code})
                      </span>
                      <span className="font-serif">-{formatCurrency(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600 dark:text-stone-300">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-semibold">Complimentary</span>
                  </div>

                  <div className="border-t border-sand/15 pt-4 flex justify-between text-sm font-bold text-stone-850 dark:text-stone-100">
                    <span>Total</span>
                    <span className="font-serif text-base text-maroon dark:text-gold">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Coupon input */}
                {!coupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-white dark:bg-stone-900 border border-sand rounded-xl pl-8 pr-3 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-850 dark:text-stone-200"
                      />
                      <Ticket className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                    </div>
                    <button
                      type="submit"
                      className="bg-maroon hover:bg-maroon-light text-white font-sans font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/20 px-3.5 py-2.5 rounded-xl border border-emerald-100/50">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{coupon.code} Applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[10px] font-sans font-bold text-rose-600 hover:text-rose-800 uppercase"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full bg-maroon hover:bg-maroon-light text-white dark:bg-gold dark:text-maroon font-sans font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all shadow-premium flex items-center justify-center gap-2 group"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

              </div>

              {/* Continue Shopping link */}
              <div className="text-center">
                <Link href="/shop" className="text-xs font-sans font-bold text-stone-500 hover:text-maroon transition-colors">
                  ← Continue Shopping
                </Link>
              </div>

            </div>

          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-24 bg-card-bg rounded-[32px] border border-dashed border-sand/35 space-y-6 max-w-xl mx-auto shadow-premium">
            <div className="mx-auto w-16 h-16 rounded-full bg-sand-light flex items-center justify-center text-maroon">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-xl text-stone-850 dark:text-stone-150 font-medium">Your Cart is Empty</h2>
              <p className="text-xs text-stone-500 font-sans max-w-xs mx-auto">
                Explore our catalog of hand-woven beaded creations and discover something made for you.
              </p>
            </div>
            <Link
              href="/shop"
              className="bg-maroon hover:bg-maroon-light text-white font-sans font-bold text-xs tracking-widest uppercase px-8 py-3.5 rounded-xl transition-all inline-block shadow-premium"
            >
              Shop Collection
            </Link>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}
