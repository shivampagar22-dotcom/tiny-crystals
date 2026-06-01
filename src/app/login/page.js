"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";
import { Mail, Lock, User, Key, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, login, register, loginWithGoogle } = useAuth();
  const { triggerToast } = useShop();

  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        triggerToast("Welcome back!");
      } else {
        await register(email, password, displayName);
        triggerToast("Account created successfully!");
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      await loginWithGoogle();
      triggerToast("Welcome!");
    } catch (err) {
      setErrorMsg(err.message || "Google Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 max-w-md w-full mx-auto px-4 sm:px-6 py-16 flex flex-col justify-center min-h-[75vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-card-bg rounded-[32px] p-8 border border-sand/20 shadow-premium space-y-6"
      >
        {/* Toggle Headings */}
        <div className="text-center flex flex-col items-center">
          <div className="relative w-16 h-16 overflow-hidden rounded-full border border-sand/30 bg-white p-0.5 shadow-md mb-2">
            <img
              src="/logo.png"
              alt="Tiny Crystals Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <span className="font-serif text-2xl tracking-[0.15em] uppercase text-maroon dark:text-gold font-bold">
            Tiny Crystals
          </span>
          <h1 className="font-serif text-xl font-medium text-stone-850 dark:text-stone-150 mt-1">
            {mode === "login" ? "Sign In to Atelier" : "Create Artisan Account"}
          </h1>
          <p className="text-[10px] text-stone-400 font-sans tracking-wide uppercase mt-1">
            {mode === "login" ? "Enter your email & password" : "Join our micro-beaded world"}
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100/50 p-4 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-400 font-sans">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <AnimatePresence mode="wait">
            {mode === "register" && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1"
              >
                <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-450">Display Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-sand/35 rounded-xl pl-9 pr-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-450">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-sand/35 rounded-xl pl-9 pr-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-450">Password</label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => triggerToast("Password reset link sent to " + (email || "your email"), "info")}
                  className="text-[9px] font-sans font-bold text-stone-400 hover:text-maroon uppercase"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-sand/35 rounded-xl pl-9 pr-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-maroon text-stone-850 dark:text-stone-200"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-maroon hover:bg-maroon-light text-white dark:bg-gold dark:text-maroon font-sans font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all shadow-premium flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>
                <span>{mode === "login" ? "Sign In" : "Register"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

        </form>

        {/* Separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-sand/20"></div>
          <span className="flex-shrink mx-4 text-[9px] font-sans text-stone-400 uppercase tracking-widest">Or Continue With</span>
          <div className="flex-grow border-t border-sand/20"></div>
        </div>

        {/* Google OAuth Login */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full border border-sand hover:bg-stone-50 dark:hover:bg-stone-900 font-sans font-bold text-xs tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-stone-700 dark:text-stone-300"
        >
          {/* Simple google SVG icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.01c2.34-2.16 3.685-5.32 3.685-8.74Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.12c-1.12.75-2.54 1.19-3.95 1.19-3.05 0-5.63-2.06-6.55-4.83H1.31v3.23A12 12 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.45 14.33a7.14 7.14 0 0 1 0-4.66V6.44H1.31a12 12 0 0 0 0 11.12l4.14-3.23Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.94 11.94 0 0 0 12 0 12 12 0 0 0 1.31 6.44l4.14 3.23c.92-2.77 3.5-4.83 6.55-4.83Z"
            />
          </svg>
          Google Profile
        </button>

        {/* Toggle Mode Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-xs font-sans text-stone-500 hover:text-maroon transition-colors"
          >
            {mode === "login" ? (
              <>Do not have an account? <strong className="text-maroon dark:text-gold font-bold">Register</strong></>
            ) : (
              <>Already have an account? <strong className="text-maroon dark:text-gold font-bold">Sign In</strong></>
            )}
          </button>
        </div>

      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-sand-light/30">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
        </div>
      }>
        <LoginContent />
      </Suspense>
      <Footer />
    </>
  );
}
