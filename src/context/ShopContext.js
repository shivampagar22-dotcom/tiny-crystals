"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { mockDb, shopDb, isMock } from "@/lib/firebase";

const ShopContext = createContext();

const loadStoredItemsWithCatalog = (storageKey, includeQuantity = false) => {
  if (typeof window === "undefined") return [];
  const savedItems = localStorage.getItem(storageKey);
  if (!savedItems) return [];

  try {
    const catalog = mockDb.getProducts();
    return JSON.parse(savedItems).map((item) => {
      const catalogItem = catalog.find((product) => product.id === item.id);
      if (!catalogItem) return item;
      return includeQuantity ? { ...catalogItem, quantity: item.quantity } : catalogItem;
    });
  } catch (e) {
    return [];
  }
};

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(() => (isMock ? mockDb.getProducts() : []));
  const [orders, setOrders] = useState(() => (isMock ? mockDb.getOrders() : []));
  const [customers, setCustomers] = useState(() => (isMock ? mockDb.getCustomers() : []));
  const [cart, setCart] = useState(() => loadStoredItemsWithCatalog("nomiki_cart", true));
  const [wishlist, setWishlist] = useState(() => loadStoredItemsWithCatalog("nomiki_wishlist"));
  const [coupon, setCoupon] = useState(null); // { code: "WELCOME10", discountPercent: 10 }
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(() => !isMock);

  // Dynamic Toast trigger
  const triggerToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (isMock) return;

    let active = true;

    Promise.all([
      shopDb.getProducts(),
      shopDb.getOrders(),
      shopDb.getCustomers(),
    ])
      .then(([loadedProducts, loadedOrders, loadedCustomers]) => {
        if (!active) return;
        setProducts(loadedProducts);
        setOrders(loadedOrders);
        setCustomers(loadedCustomers);
      })
      .catch((error) => {
        console.error("Unable to load Firebase shop data", error);
        if (active) {
          triggerToast("Unable to load Firebase shop data.", "error");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Sync Cart to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("nomiki_cart", JSON.stringify(cart));
    }
  }, [cart, loading]);

  // Sync Wishlist to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("nomiki_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, loading]);

  // Cart operations
  const addToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        const newQty = exists.quantity + qty;
        if (newQty > product.stock) {
          triggerToast(`Cannot add more. Only ${product.stock} items left in stock.`, "error");
          return prevCart;
        }
        triggerToast(`Updated ${product.name} quantity in Cart!`);
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      if (qty > product.stock) {
        triggerToast(`Cannot add. Only ${product.stock} items left in stock.`, "error");
        return prevCart;
      }
      triggerToast(`${product.name} added to Cart!`);
      return [...prevCart, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    triggerToast("Item removed from Cart.", "info");
  };

  const updateCartQuantity = (productId, qty) => {
    const product = products.find((p) => p.id === productId);
    if (product && qty > product.stock) {
      triggerToast(`Only ${product.stock} items left in stock.`, "error");
      return;
    }
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.find((item) => item.id === product.id);
      if (exists) {
        triggerToast("Removed from Wishlist.", "info");
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      triggerToast("Added to Wishlist!");
      return [...prevWishlist, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Coupon code operation
  const applyCoupon = (code) => {
    const uppercaseCode = code.trim().toUpperCase();
    if (uppercaseCode === "WELCOME10") {
      setCoupon({ code: "WELCOME10", discountPercent: 10 });
      triggerToast("Coupon 'WELCOME10' applied! 10% discount off subtotal.");
      return true;
    } else if (uppercaseCode === "HANDMADE20") {
      setCoupon({ code: "HANDMADE20", discountPercent: 20 });
      triggerToast("Coupon 'HANDMADE20' applied! 20% discount off subtotal.");
      return true;
    } else {
      triggerToast("Invalid promo coupon code.", "error");
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    triggerToast("Coupon removed.", "info");
  };

  // Calculation helpers
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    if (!coupon) return 0;
    return parseFloat(((getSubtotal() * coupon.discountPercent) / 100).toFixed(2));
  };

  const getTotal = () => {
    return parseFloat((getSubtotal() - getDiscountAmount()).toFixed(2));
  };

  // Place order
  const checkoutOrder = async (shippingDetails, paymentId = "RAZORPAY_MOCK_ID") => {
    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const total = getTotal();

    const newOrder = {
      id: "ord-" + Math.floor(1000 + Math.random() * 9000),
      customer: shippingDetails,
      items: [...cart],
      subtotal,
      discount,
      total,
      status: "Pending",
      paymentMethod: "Razorpay Integrated",
      paymentId,
      createdAt: new Date().toISOString(),
    };

    // 1. Deduct stock
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((item) => item.id === prod.id);
      if (cartItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - cartItem.quantity),
        };
      }
      return prod;
    });

    // 2. Save
    setProducts(updatedProducts);

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    setCustomers(await shopDb.getCustomers().catch(() => customers));

    await shopDb.saveProducts(updatedProducts);
    await shopDb.saveOrders(updatedOrders);
    setCustomers(await shopDb.getCustomers().catch(() => customers));

    // 3. Clear cart
    clearCart();
    triggerToast("Order placed successfully! Redirecting...");
    return newOrder;
  };

  // Admin Catalog operations
  const addProduct = async (newProd) => {
    const finalProduct = {
      ...newProd,
      id: "prod-" + Math.floor(100 + Math.random() * 900),
      popularity: 50,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
    };
    const updated = [...products, finalProduct];
    setProducts(updated);
    await shopDb.saveProducts(updated);
    triggerToast(`Added ${newProd.name} to collection.`);
    return finalProduct;
  };

  const editProduct = async (id, updatedData) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
    setProducts(updated);
    await shopDb.saveProducts(updated);
    triggerToast(`Updated product details.`);
  };

  const deleteProduct = async (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    await shopDb.saveProducts(updated);
    triggerToast(`Product removed from shop catalog.`, "info");
  };

  // Admin Order operations
  const updateOrderStatus = async (orderId, newStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    await shopDb.saveOrders(updated);
    triggerToast(`Order #${orderId} status updated to ${newStatus}.`);
  };

  // Submit Product Review
  const addReview = async (productId, reviewObj) => {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;

    const newReview = {
      id: Date.now(),
      user: reviewObj.user || "Anonymous",
      rating: Number(reviewObj.rating),
      comment: reviewObj.comment,
      date: new Date().toISOString().split("T")[0]
    };

    const updatedReviews = [...(targetProduct.reviews || []), newReview];
    
    // Recalculate average rating
    const avgRating = parseFloat(
      (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
    );

    const updatedProduct = {
      ...targetProduct,
      reviews: updatedReviews,
      reviewsCount: updatedReviews.length,
      rating: avgRating
    };

    const updatedProducts = products.map(p => p.id === productId ? updatedProduct : p);
    setProducts(updatedProducts);
    await shopDb.saveProducts(updatedProducts);
    triggerToast("Thank you for your review!");
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        orders,
        customers,
        cart,
        wishlist,
        coupon,
        toasts,
        loading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        getSubtotal,
        getDiscountAmount,
        getTotal,
        checkoutOrder,
        addProduct,
        editProduct,
        deleteProduct,
        updateOrderStatus,
        addReview,
        triggerToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
