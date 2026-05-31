"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useShop } from "@/context/ShopContext";
import { formatCurrency } from "@/lib/currency";

export default function ProductCard({ product, onQuickView }) {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const isFav = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-card-bg rounded-[24px] overflow-hidden shadow-premium group border border-sand/15 relative flex flex-col justify-between"
    >
      
      {/* Product Image Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-sand-light/50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Out of Stock Ribbon */}
        {product.stock === 0 && (
          <div className="absolute top-4 left-4 bg-stone-800 text-stone-200 text-[10px] font-sans font-bold tracking-widest uppercase px-3 py-1.5 rounded-full z-10">
            Sold Out
          </div>
        )}

        {/* Favorite Icon Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full glass hover:bg-white shadow-sm transition-all duration-300 z-10"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? "fill-maroon text-maroon" : "text-stone-600 hover:text-maroon"
            }`}
          />
        </button>

        {/* Action Button Overlays (fade and slide in on hover) */}
        <div className="absolute inset-0 bg-maroon/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
          
          <button
            onClick={() => onQuickView?.(product)}
            className="p-3 rounded-full bg-white hover:bg-maroon hover:text-white text-maroon shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            title="Quick View"
            disabled={!onQuickView}
          >
            <Eye className="w-5 h-5" />
          </button>
          
          {product.stock > 0 && (
            <button
              onClick={() => addToCart(product, 1)}
              className="p-3 rounded-full bg-white hover:bg-maroon hover:text-white text-maroon shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
              title="Add to Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          )}

        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-sans tracking-widest uppercase text-stone-400 dark:text-stone-500 font-semibold">
            {product.category}
          </span>
          <Link href={`/product/${product.id}`} className="block mt-1">
            <h3 className="font-product text-base text-stone-850 dark:text-stone-100 hover:text-maroon dark:hover:text-gold transition-colors font-semibold line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
          
          {/* Rating Display */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-[11px] font-sans text-stone-500 dark:text-stone-400">
              {product.rating} <span className="text-stone-300 dark:text-stone-600">({product.reviewsCount})</span>
            </span>
          </div>
        </div>

        {/* Price & Primary Link button */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-sand/10">
          <span className="font-serif text-lg font-semibold text-maroon dark:text-gold">
            {formatCurrency(product.price)}
          </span>
          
          <Link
            href={`/product/${product.id}`}
            className="text-[11px] font-sans font-bold tracking-widest uppercase text-stone-600 dark:text-stone-300 hover:text-maroon dark:hover:text-gold transition-all"
          >
            Details →
          </Link>
        </div>

      </div>

    </motion.div>
  );
}
