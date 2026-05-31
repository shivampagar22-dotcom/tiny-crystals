"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import ToastContainer from "@/components/Toast";
import { SlidersHorizontal, Search, RotateCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/currency";

const categories = ["All", "Necklaces", "Bracelets", "Earrings", "Rings", "Custom Jewelry"];

function ShopContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products } = useShop();

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categoryParam = searchParams.get("category");
  const initialCategory = categories.find(c => c.toLowerCase() === categoryParam?.toLowerCase()) || "All";

  // States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("popularity"); // popularity, price-asc, price-desc
  const [priceRange, setPriceRange] = useState(6000); // max price filter

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("popularity");
    setPriceRange(6000);
    router.replace("/shop");
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((prod) => {
      const matchesCategory = selectedCategory === "All" || prod.category === selectedCategory;
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prod.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = prod.price <= priceRange;
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return b.popularity - a.popularity; // popularity sort
    });

  return (
    <>
      <ToastContainer />
      
      {/* Banner/Header */}
      <section className="bg-sand-light/40 dark:bg-stone-900/40 py-12 border-b border-sand/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
            Atelier Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-850 dark:text-stone-100 font-medium">
            The Beaded Collection
          </h1>
          <p className="text-xs text-stone-500 font-sans max-w-md mx-auto">
            Explore our range of meticulously hand-beaded necklaces, bracelets, earrings, rings, and custom pieces.
          </p>
        </div>
      </section>

      {/* Main content grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Sidebar Filters (Desktop) */}
          <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block space-y-8">
            
            {/* Search */}
            <div className="space-y-2">
              <h3 className="text-xs font-sans font-bold tracking-widest uppercase text-stone-700 dark:text-stone-300">
                Search Collection
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Find products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-sand/40 rounded-xl pl-9 pr-4 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-850 dark:text-stone-200"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-xs font-sans font-bold tracking-widest uppercase text-stone-700 dark:text-stone-300">
                Categories
              </h3>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-xs font-sans py-1.5 transition-colors ${
                      selectedCategory === cat
                        ? "text-maroon dark:text-gold font-bold pl-2 border-l-2 border-maroon dark:border-gold"
                        : "text-stone-500 hover:text-maroon dark:hover:text-gold"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-sans font-bold tracking-widest uppercase text-stone-700 dark:text-stone-300">
                  Filter by Price
                </h3>
                <span className="text-xs font-bold font-sans text-maroon dark:text-gold">
                  {formatCurrency(priceRange)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-maroon dark:accent-gold bg-stone-200 h-1 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-sans">
                <span>Min: {formatCurrency(500)}</span>
                <span>Max: {formatCurrency(8000)}</span>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-2 border border-sand/40 hover:bg-stone-50 dark:hover:bg-stone-900 py-2.5 rounded-xl text-xs font-sans font-bold tracking-wider uppercase text-stone-650 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>

          </aside>

          {/* RIGHT: Grid & Header */}
          <div className="flex-1 space-y-6">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center border-b border-sand/15 pb-4 gap-4">
              <span className="text-xs text-stone-500 font-sans">
                Showing {filteredProducts.length} premium pieces
              </span>
              
              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1.5 border border-sand rounded-xl px-3.5 py-2 text-xs font-sans text-stone-750 hover:bg-stone-50"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                </button>

                {/* Sort selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-stone-900 border border-sand rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-850 dark:text-stone-200"
                >
                  <option value="popularity">Sort by Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-stone-50 dark:bg-stone-900/20 rounded-[32px] border border-dashed border-sand/30 space-y-3">
                <p className="text-sm font-sans text-stone-500">
                  No matching beaded jewelry found. Try resetting filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-maroon hover:bg-maroon-light text-white font-sans text-xs tracking-widest uppercase px-6 py-2.5 rounded-xl transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* MOBILE FILTERS DRAWER */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-80 bg-[var(--background)] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-sand/20 z-10"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-sand/15 pb-4">
                  <h2 className="font-serif text-lg font-medium text-stone-850 dark:text-stone-150">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="p-1 rounded-full hover:bg-stone-100">
                    <X className="w-5 h-5 text-stone-550" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="space-y-2">
                  <h3 className="text-xs font-sans font-bold tracking-widest uppercase text-stone-700">Search</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Find products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white dark:bg-stone-900 border border-sand rounded-xl pl-9 pr-4 py-2 text-xs font-sans text-stone-800"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-3">
                  <h3 className="text-xs font-sans font-bold tracking-widest uppercase text-stone-700">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs font-sans px-3.5 py-2 rounded-full border transition-all ${
                          selectedCategory === cat
                            ? "bg-maroon border-maroon text-white dark:bg-gold dark:border-gold dark:text-maroon font-bold"
                            : "border-sand/40 text-stone-550 hover:bg-stone-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-sans font-bold tracking-widest uppercase text-stone-700">Filter by Price</h3>
                    <span className="text-xs font-bold text-maroon">{formatCurrency(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="8000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-maroon bg-stone-200 h-1 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-8 space-y-2">
                <button
                  onClick={handleResetFilters}
                  className="w-full flex items-center justify-center gap-2 border border-sand py-3 rounded-xl text-xs font-sans font-bold tracking-wider uppercase text-stone-650"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-maroon text-white dark:bg-gold dark:text-maroon font-sans font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl shadow-premium"
                >
                  Apply Filters
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-sand-light/30">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
        </div>
      }>
        <ShopContentInner />
      </Suspense>
      <Footer />
    </>
  );
}
