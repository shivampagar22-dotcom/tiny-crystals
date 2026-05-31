"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";
import QuickViewModal from "@/components/QuickViewModal";
import { Heart, ShoppingBag, Eye, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/currency";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleMoveToCart = (prod) => {
    addToCart(prod, 1);
    toggleWishlist(prod); // Remove from wishlist
  };

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl text-stone-850 dark:text-stone-100 font-medium mb-8">
          Your Wishlist
        </h1>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlist.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card-bg rounded-[24px] overflow-hidden shadow-premium group border border-sand/15 relative flex flex-col justify-between"
                >
                  {/* Image section */}
                  <div className="relative aspect-square w-full overflow-hidden bg-sand-light/50">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Quick view button */}
                    <div className="absolute inset-0 bg-maroon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setQuickViewProduct(prod)}
                        className="p-3 rounded-full bg-white text-maroon hover:bg-maroon hover:text-white shadow-lg transition-colors"
                        title="Quick View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Delete button (absolute) */}
                    <button
                      onClick={() => toggleWishlist(prod)}
                      className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white text-stone-600 hover:text-rose-600 shadow-sm transition-colors z-10"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details section */}
                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-[10px] font-sans tracking-widest uppercase text-stone-400 font-bold">
                        {prod.category}
                      </span>
                      <h3 className="font-product text-sm sm:text-base text-stone-850 dark:text-stone-150 font-semibold leading-snug truncate mt-1">
                        {prod.name}
                      </h3>
                      <p className="text-sm font-serif font-semibold text-maroon dark:text-gold mt-1.5">
                        {formatCurrency(prod.price)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {prod.stock > 0 ? (
                        <button
                          onClick={() => handleMoveToCart(prod)}
                          className="flex-1 bg-maroon hover:bg-maroon-light text-white dark:bg-gold dark:text-maroon font-sans font-bold text-[10px] tracking-widest uppercase py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Move to Cart
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 bg-stone-200 dark:bg-stone-800 text-stone-450 dark:text-stone-500 font-sans font-bold text-[10px] tracking-widest uppercase py-3 rounded-xl cursor-not-allowed text-center"
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-24 bg-card-bg rounded-[32px] border border-dashed border-sand/35 space-y-6 max-w-xl mx-auto shadow-premium">
            <div className="mx-auto w-16 h-16 rounded-full bg-sand-light flex items-center justify-center text-maroon">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-xl text-stone-850 dark:text-stone-150 font-medium">Your Wishlist is Empty</h2>
              <p className="text-xs text-stone-500 font-sans max-w-xs mx-auto">
                Save your favorite beaded creations here while exploring the catalog.
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
