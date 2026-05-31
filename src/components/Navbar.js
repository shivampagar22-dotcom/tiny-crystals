"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  LogOut,
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist } = useShop();
  const { currentUser, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const theme = localStorage.getItem("nomiki_theme");
    return theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Scroll handler for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark Mode init
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("nomiki_theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("nomiki_theme", "dark");
      setDarkMode(true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
            ? "bg-sand/30 shadow-premium py-3"
            : "bg-sand/10 py-5 border-b border-sand/30"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Mobile Menu Toggle */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-maroon hover:text-dusty-pink dark:text-creme transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative font-sans text-sm tracking-widest uppercase transition-colors hover:text-maroon dark:hover:text-gold ${isActive
                        ? "text-maroon dark:text-gold font-semibold"
                        : "text-stone-600 dark:text-stone-300"
                      }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-[-4px] left-0 right-0 h-[1.5px] bg-maroon dark:bg-gold"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>




            {/* Toolbar Buttons */}
            <div className="flex items-center space-x-3 sm:space-x-4">

              {/* Search Toggle */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="text-stone-600 dark:text-stone-300 hover:text-maroon dark:hover:text-gold transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="text-stone-600 dark:text-stone-300 hover:text-maroon dark:hover:text-gold transition-colors"
                aria-label="Theme toggle"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative text-stone-600 dark:text-stone-300 hover:text-maroon dark:hover:text-gold transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-maroon dark:bg-gold text-[9px] font-bold text-white dark:text-maroon animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                href="/cart"
                className="relative text-stone-600 dark:text-stone-300 hover:text-maroon dark:hover:text-gold transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-maroon dark:bg-gold text-[9px] font-bold text-white dark:text-maroon animate-pulse">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>

              {/* Profile Link or Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center text-stone-600 dark:text-stone-300 hover:text-maroon dark:hover:text-gold transition-colors"
                  aria-label="User profile"
                >
                  <User className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setShowProfileDropdown(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-3 w-56 glass rounded-2xl shadow-premium py-2 z-40 border border-sand/30"
                      >
                        {currentUser ? (
                          <>
                            <div className="px-4 py-2 border-b border-sand/20">
                              <p className="text-xs text-stone-400 font-sans">Signed in as</p>
                              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate font-sans">
                                {currentUser.displayName}
                              </p>
                            </div>

                            {currentUser.role === "admin" && (
                              <Link
                                href="/admin"
                                onClick={() => setShowProfileDropdown(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-sand/20 transition-colors font-sans"
                              >
                                <Sliders className="w-4 h-4 text-maroon dark:text-gold" />
                                Admin Dashboard
                              </Link>
                            )}

                            <button
                              onClick={() => {
                                logout();
                                setShowProfileDropdown(false);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-sand/20 transition-colors text-left font-sans"
                            >
                              <LogOut className="w-4 h-4 text-rose-500" />
                              Sign Out
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/login"
                              onClick={() => setShowProfileDropdown(false)}
                              className="block px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-sand/20 transition-colors font-sans"
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/login?mode=register"
                              onClick={() => setShowProfileDropdown(false)}
                              className="block px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-sand/20 transition-colors font-sans"
                            >
                              Create Account
                            </Link>
                          </>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Search Overlay Panel */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 right-0 glass shadow-md py-4 px-6 border-t border-sand/20"
            >
              <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex gap-2">
                <input
                  type="text"
                  placeholder="Search our luxury collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white/70 dark:bg-stone-900/70 border border-sand rounded-xl px-4 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-maroon hover:bg-maroon-light text-white px-5 py-2 rounded-xl text-sm font-sans tracking-wider uppercase transition-colors"
                >
                  Go
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Dropdown Nav links */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass overflow-hidden border-t border-sand/20 shadow-lg"
            >
              <div className="px-4 pt-3 pb-4 space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2.5 rounded-xl font-sans text-sm tracking-widest uppercase transition-all ${isActive
                          ? "bg-maroon text-white dark:bg-gold dark:text-maroon font-semibold"
                          : "text-stone-600 dark:text-stone-300 hover:bg-sand/10"
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
