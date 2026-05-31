"use client";

import React, { useState } from "react";
import { X, ShoppingBag, Plus, Minus, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "@/context/ShopContext";
import { formatCurrency } from "@/lib/currency";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product ? product.images[0] : "");

  if (!product) return null;

  const isFav = isInWishlist(product.id);

  const handleQtyChange = (val) => {
    const newVal = quantity + val;
    if (newVal >= 1 && newVal <= product.stock) {
      setQuantity(newVal);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Glass Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-maroon-dark/70"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-sand-light dark:bg-stone-850 w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl relative border border-sand-dark/20 dark:border-maroon/20 z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-sand dark:bg-stone-800 hover:bg-sand-dark dark:hover:bg-stone-700 transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-stone-650" />
          </button>

          {/* Left: Product Images */}
          <div className="w-full md:w-1/2 p-6 flex flex-col gap-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-sand-light relative">
              <img
                src={activeImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      (activeImage || product.images[0]) === img ? "border-maroon" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-sans tracking-widest uppercase text-stone-400 font-bold">
                  {product.category}
                </span>
                <h2 className="font-product text-2xl sm:text-3xl text-stone-850 dark:text-stone-100 font-semibold mt-1 leading-snug">
                  {product.name}
                </h2>
                
                {/* Rating & Review sum */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-xs font-sans text-stone-500">
                    {product.rating} ({product.reviewsCount} customer reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-2xl font-serif font-bold text-maroon dark:text-gold">
                {formatCurrency(product.price)}
              </div>

              {/* Stock availability */}
              <div className="text-xs font-sans">
                {product.stock > 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                    In Stock ({product.stock} items left)
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded-full">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                {product.details}
              </p>

              {/* Materials info */}
              <div className="bg-sand-light/50 dark:bg-stone-900/50 p-4 rounded-2xl border border-sand/10 space-y-1">
                <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">
                  Materials & Detail
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                  {product.materials}
                </p>
              </div>
            </div>

            {/* Actions: Qty + Cart + Fav */}
            <div className="mt-8 pt-6 border-t border-sand/15 flex flex-wrap gap-4 items-center">
              
              {/* Quantity selector */}
              {product.stock > 0 && (
                <div className="flex items-center border border-sand rounded-xl px-2 py-1.5 bg-white/50 dark:bg-stone-900/50">
                  <button
                    onClick={() => handleQtyChange(-1)}
                    className="p-1 text-stone-500 hover:text-maroon transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-sans">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(1)}
                    className="p-1 text-stone-500 hover:text-maroon transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Add to Cart button */}
              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[150px] bg-maroon hover:bg-maroon-light text-white dark:bg-gold dark:text-maroon font-sans font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 min-w-[150px] bg-stone-300 dark:bg-stone-800 text-stone-500 dark:text-stone-600 font-sans font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl cursor-not-allowed text-center"
                >
                  Out of Stock
                </button>
              )}

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3 rounded-xl border border-sand hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFav ? "fill-maroon text-maroon" : "text-stone-600"
                  }`}
                />
              </button>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
