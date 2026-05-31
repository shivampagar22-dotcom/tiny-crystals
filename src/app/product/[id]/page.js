"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ToastContainer from "@/components/Toast";
import { 
  Heart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Star, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/currency";

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { products, addToCart, toggleWishlist, isInWishlist, addReview, triggerToast } = useShop();
  const product = useMemo(() => products.find((p) => p.id === id) || null, [id, products]);

  // States
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Review states
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-sand-light/30">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon"></div>
          <p className="text-sm font-sans text-stone-500 mt-4">Loading jewelry details...</p>
        </div>
        <Footer />
      </>
    );
  }

  const isFav = isInWishlist(product.id);

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleQtyChange = (val) => {
    const newVal = quantity + val;
    if (newVal >= 1 && newVal <= product.stock) {
      setQuantity(newVal);
    }
  };

  // Magnifier Zoom Handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      triggerToast("Please fill in both name and review comment.", "error");
      return;
    }
    
    addReview(product.id, {
      user: reviewerName,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewerName("");
    setReviewComment("");
    setReviewRating(5);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Tiny Crystals! I am interested in ordering the custom ${product.name} (${formatCurrency(product.price)}). Could you provide details on custom sizes or matching pieces?`
  );

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Navigation Breadcrumbs */}
        <div className="text-xs font-sans text-stone-400 mb-8 flex gap-2">
          <Link href="/" className="hover:text-maroon">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-maroon">Shop</Link>
          <span>/</span>
          <span className="text-stone-600 font-bold dark:text-stone-300">{product.name}</span>
        </div>

        {/* Product Details Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT: Image Gallery & Magnifier */}
          <div className="lg:col-span-6 space-y-4">
            <div
              className="relative aspect-square w-full rounded-[32px] overflow-hidden bg-sand-light/50 border border-sand/20 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={activeImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-100 ease-out"
                style={{
                  transform: isHovered ? "scale(1.8)" : "scale(1)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
              
              {/* Image overlay badge */}
              <div className="absolute top-4 left-4 glass px-3.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-stone-500 font-bold font-sans">
                Zoom Gallery
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-[18px] overflow-hidden border-2 transition-all ${
                      activeImage === img
                        ? "border-maroon"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Metadata & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-sans tracking-widest uppercase text-stone-400 font-bold">
                  {product.category}
                </span>
                <h1 className="font-product text-3xl sm:text-4xl text-stone-850 dark:text-stone-100 font-semibold mt-1">
                  {product.name}
                </h1>
                
                {/* Rating display */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-xs font-sans text-stone-500">
                    {product.rating} ({product.reviewsCount} verified customer reviews)
                  </span>
                </div>
              </div>

              {/* Price display */}
              <div className="text-3xl font-serif font-bold text-maroon dark:text-gold">
                {formatCurrency(product.price)}
              </div>

              {/* Stock Badge */}
              <div>
                {product.stock > 0 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans">
                    In Stock ({product.stock} pieces left)
                  </span>
                ) : (
                  <span className="text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Details and highlights */}
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                {product.details}
              </p>

              {/* Product specifications cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-sand-light/50 dark:bg-stone-900/50 p-4 rounded-2xl border border-sand/10 space-y-1">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold" /> Materials
                  </span>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                    {product.materials}
                  </p>
                </div>
                <div className="bg-sand-light/50 dark:bg-stone-900/50 p-4 rounded-2xl border border-sand/10 space-y-1">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Care Instructions
                  </span>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                    Avoid moisture, clean with jewelry wipe, and store inside airtight linen pouch.
                  </p>
                </div>
              </div>

            </div>

            {/* User Interaction Controls */}
            <div className="pt-6 border-t border-sand/15 space-y-4">
              
              <div className="flex flex-wrap gap-4 items-center">
                {/* Quantity select */}
                {product.stock > 0 && (
                  <div className="flex items-center border border-sand rounded-xl px-2 py-1.5 bg-white/50 dark:bg-stone-900/50">
                    <button
                      onClick={() => handleQtyChange(-1)}
                      className="p-1 text-stone-500 hover:text-maroon transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-sans text-stone-800 dark:text-stone-200">
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

                {/* Add to Cart */}
                {product.stock > 0 ? (
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 min-w-[200px] bg-maroon hover:bg-maroon-light text-white dark:bg-gold dark:text-maroon font-sans font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all shadow-premium flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 min-w-[200px] bg-stone-300 dark:bg-stone-800 text-stone-500 dark:text-stone-600 font-sans font-bold text-xs tracking-widest uppercase py-4 rounded-xl cursor-not-allowed text-center"
                  >
                    Sold Out
                  </button>
                )}

                {/* Toggle Favorite */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-3.5 rounded-xl border border-sand hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFav ? "fill-maroon text-maroon" : "text-stone-600"
                    }`}
                  />
                </button>
              </div>

              {/* WhatsApp Checkout/Inquiry */}
              <a
                href={`https://wa.me/919527941185?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-sans font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all"
              >
                <MessageCircle className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                WhatsApp Inquiry
              </a>

            </div>

          </div>
        </section>

        {/* Section: Reviews Form & Log */}
        <section className="mt-20 pt-12 border-t border-sand/20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Reviews list */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-serif text-2xl text-stone-850 dark:text-stone-150 font-medium">
              Customer Reviews ({product.reviews?.length || 0})
            </h3>
            
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="bg-white/40 dark:bg-stone-900/30 p-6 rounded-2xl border border-sand/10 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 font-sans">{rev.user}</h4>
                        <span className="text-[10px] text-stone-400 font-sans">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: Math.floor(rev.rating) }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-450 dark:text-stone-500 font-sans italic">
                No reviews yet. Be the first to share your beaded experience.
              </p>
            )}
          </div>

          {/* Submit Review */}
          <div className="lg:col-span-5 bg-sand-light/30 dark:bg-stone-900/10 p-6 rounded-[24px] border border-sand/15 shadow-premium">
            <h3 className="font-serif text-lg text-stone-850 dark:text-stone-150 font-semibold mb-4">
              Write a Review
            </h3>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-500">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Sophia L."
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-850 dark:text-stone-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-500 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-amber-500"
                    >
                      <Star className={`w-6 h-6 ${reviewRating >= star ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-500">Comment</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Share details of your experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-850 dark:text-stone-200"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-maroon hover:bg-maroon-light text-white font-sans font-bold text-xs tracking-widest uppercase py-3 rounded-xl transition-all shadow-premium"
              >
                Submit Review
              </button>
            </form>
          </div>

        </section>

        {/* Section: Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <div className="text-center space-y-2 mb-12">
              <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-stone-400 font-bold block">
                Recommended Drops
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-850 font-medium">
                Related Creations
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </>
  );
}
