"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";
import { 
  Plus, 
  Trash2, 
  Edit, 
  IndianRupee, 
  ShoppingBag, 
  Boxes, 
  Users, 
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/currency";

export default function AdminDashboard() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { 
    products, 
    orders, 
    customers,
    addProduct, 
    editProduct, 
    deleteProduct, 
    updateOrderStatus,
    triggerToast 
  } = useShop();

  // Route auth guard
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.replace("/login");
    }
  }, [currentUser, router]);

  const [activeTab, setActiveTab] = useState("orders"); // orders, products, customers
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProdId, setEditingProdId] = useState(null);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Necklaces",
    price: 1499,
    stock: 10,
    materials: "",
    details: "",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"]
  });

  const [editProductState, setEditProductState] = useState({
    name: "",
    category: "Necklaces",
    price: 1499,
    stock: 10,
    materials: "",
    details: "",
    images: []
  });

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-light/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
      </div>
    );
  }

  // Derived Admin Stats
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const customerList = customers;
  const totalCustomers = customerList.length;

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.materials || !newProduct.details) {
      triggerToast("Please fill in all product details.", "error");
      return;
    }
    const finalImageUrl = newProduct.images[0]?.trim() || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";
    addProduct({
      ...newProduct,
      images: [finalImageUrl],
      price: Number(newProduct.price),
      stock: Number(newProduct.stock)
    });
    setNewProduct({
      name: "",
      category: "Necklaces",
      price: 1499,
      stock: 10,
      materials: "",
      details: "",
      images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"]
    });
    setShowAddForm(false);
  };

  const handleStartEdit = (prod) => {
    setEditingProdId(prod.id);
    setEditProductState({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      materials: prod.materials,
      details: prod.details,
      images: prod.images
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    editProduct(editingProdId, {
      ...editProductState,
      price: Number(editProductState.price),
      stock: Number(editProductState.stock)
    });
    setEditingProdId(null);
  };

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-maroon text-creme-light dark:bg-maroon-dark p-6 sm:p-8 rounded-[28px] shadow-premium">
          <div>
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-gold font-bold">
              Secure Operations
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium mt-1">
              Artisan Dashboard
            </h1>
            <p className="text-[11px] text-creme/60 font-sans mt-0.5">
              Welcome back, Ganga. Manage your jewelry inventory and order list.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-xs font-sans">
            <UserCheck className="w-4 h-4 text-gold" />
            <span>Admin Mode</span>
          </div>
        </div>

        {/* Analytics Summary */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-card-bg p-5 rounded-2xl border border-sand/15 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest">Revenue</span>
              <IndianRupee className="w-4 h-4 text-maroon dark:text-gold" />
            </div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-stone-850 dark:text-stone-100">
              {formatCurrency(revenue)}
            </p>
            <span className="text-[9px] font-sans text-stone-450 block">Cumulative sales</span>
          </div>

          <div className="bg-card-bg p-5 rounded-2xl border border-sand/15 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest">Orders</span>
              <ShoppingBag className="w-4 h-4 text-maroon dark:text-gold" />
            </div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-stone-850 dark:text-stone-100">
              {totalOrders}
            </p>
            <span className="text-[9px] font-sans text-stone-450 block">Customer checkouts</span>
          </div>

          <div className="bg-card-bg p-5 rounded-2xl border border-sand/15 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest">Catalog</span>
              <Boxes className="w-4 h-4 text-maroon dark:text-gold" />
            </div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-stone-850 dark:text-stone-100">
              {totalProducts}
            </p>
            <span className="text-[9px] font-sans text-stone-450 block">Unique active creations</span>
          </div>

          <div className="bg-card-bg p-5 rounded-2xl border border-sand/15 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest">Customers</span>
              <Users className="w-4 h-4 text-maroon dark:text-gold" />
            </div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-stone-850 dark:text-stone-100">
              {totalCustomers}
            </p>
            <span className="text-[9px] font-sans text-stone-450 block">Signed up accounts</span>
          </div>

        </section>

        {/* Tab Controls */}
        <div className="flex border-b border-sand/20">
          {[
            { id: "orders", label: "Customer Orders" },
            { id: "products", label: "Jewelry Catalog" },
            { id: "customers", label: "Client Records" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-sans text-xs font-bold tracking-widest uppercase border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-maroon text-maroon dark:border-gold dark:text-gold"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Tab Panels */}
        <section className="bg-card-bg rounded-[24px] border border-sand/15 shadow-premium overflow-hidden">
          
          {/* TAB 1: Orders Management */}
          {activeTab === "orders" && (
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-sand/15 text-stone-400 uppercase tracking-wider text-[9px] font-bold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total Charged</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/10">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-sand-light/10">
                      <td className="py-4 font-mono font-bold text-stone-800 dark:text-stone-250">#{order.id}</td>
                      <td className="py-4">
                        <div className="font-bold text-stone-800 dark:text-stone-200">{order.customer.name}</div>
                        <div className="text-[10px] text-stone-400">{order.customer.email}</div>
                      </td>
                      <td className="py-4 max-w-xs truncate">
                        {order.items.map(item => `${item.name} (${item.quantity})`).join(", ")}
                      </td>
                      <td className="py-4 font-serif font-bold text-maroon dark:text-gold">{formatCurrency(order.total)}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "Delivered" 
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : order.status === "Shipped"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-white dark:bg-stone-900 border border-sand rounded-xl px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Products Management */}
          {activeTab === "products" && (
            <div className="p-6 space-y-6">
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-500 font-sans">
                  Total items: {products.length} jewelry pieces
                </span>
                
                <button
                  onClick={() => {
                    setEditingProdId(null);
                    setShowAddForm(!showAddForm);
                  }}
                  className="bg-maroon hover:bg-maroon-light text-white dark:bg-gold dark:text-maroon font-sans font-bold text-xs tracking-widest uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-premium"
                >
                  <Plus className="w-4 h-4" />
                  Add Jewelry
                </button>
              </div>

              {/* Add Product Form Overlay */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-sand-light/30 dark:bg-stone-900/10 p-6 rounded-2xl border border-sand/20 shadow-sm"
                  >
                    <h3 className="font-serif text-base font-semibold mb-4 text-stone-850 dark:text-stone-150">Create New Collection Item</h3>
                    
                    <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-500">Product Name</label>
                          <input
                            type="text"
                            required
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1 col-span-2">
                            <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-500">Category</label>
                            <select
                              value={newProduct.category}
                              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                              className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                            >
                              <option>Necklaces</option>
                              <option>Bracelets</option>
                              <option>Earrings</option>
                              <option>Rings</option>
                              <option>Custom Jewelry</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-500">Price (INR)</label>
                            <input
                              type="number"
                              required
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                              className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-2 py-2 focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-500">Stock Count</label>
                          <input
                            type="number"
                            required
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                            className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-500">Materials Summary</label>
                          <input
                            type="text"
                            required
                            placeholder="E.g. 14k gold, Miyuki beads, pearls"
                            value={newProduct.materials}
                            onChange={(e) => setNewProduct({ ...newProduct, materials: e.target.value })}
                            className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                          />
                        </div>

                        {/* Image URL Input */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-500">Image URL</label>
                          <input
                            type="text"
                            placeholder="Paste custom image link (optional)"
                            value={newProduct.images[0] || ""}
                            onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                            className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                          />
                        </div>

                        {/* Preset luxury options */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-500 block">Or Quick Select Preset Luxury Image</label>
                          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                            {[
                              { label: "Maroon Collar", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop" },
                              { label: "Pearl Choker", url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop" },
                              { label: "Gold Ring", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop" },
                              { label: "Emerald Drops", url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop" },
                              { label: "Classic Pearls", url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop" }
                            ].map((preset, idx) => {
                              const isSelected = newProduct.images[0] === preset.url;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setNewProduct({ ...newProduct, images: [preset.url] })}
                                  className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                                    isSelected 
                                      ? "border-maroon dark:border-gold scale-105 shadow-md" 
                                      : "border-sand/20 opacity-60 hover:opacity-100"
                                  }`}
                                  title={preset.label}
                                >
                                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Image Preview */}
                        {newProduct.images[0] && (
                          <div className="flex items-center gap-3 bg-white/40 dark:bg-stone-900/40 p-2 rounded-xl border border-sand/20">
                            <img
                              src={newProduct.images[0]}
                              alt="Preview"
                              className="w-10 h-10 object-cover rounded-lg border border-sand/30"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";
                              }}
                            />
                            <div className="flex-grow min-w-0">
                              <p className="text-[8px] font-sans font-bold uppercase tracking-widest text-stone-400">Selected Image Preview</p>
                              <p className="text-[10px] text-stone-500 dark:text-stone-450 truncate">{newProduct.images[0]}</p>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-500">Details / Description</label>
                          <textarea
                            required
                            rows="2"
                            value={newProduct.details}
                            onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })}
                            className="w-full bg-white dark:bg-stone-900 border border-sand/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-maroon text-stone-800 dark:text-stone-200"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-maroon hover:bg-maroon-light text-white font-sans font-bold text-xs tracking-widest uppercase py-3 rounded-xl transition-all shadow-premium"
                        >
                          Submit to Shop
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Product Inventory Table List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-sand/15 text-stone-400 uppercase tracking-wider text-[9px] font-bold">
                      <th className="pb-3">Image</th>
                      <th className="pb-3">Product Info</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Stock status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/10">
                    {products.map((prod) => (
                      <React.Fragment key={prod.id}>
                        {editingProdId === prod.id ? (
                          // Edit Form Inline Row
                          <tr>
                            <td colSpan="6" className="py-4 bg-sand-light/10 p-4 rounded-xl">
                              <form onSubmit={handleSaveEdit} className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold uppercase text-stone-450">Name</label>
                                  <input
                                    type="text"
                                    required
                                    value={editProductState.name}
                                    onChange={(e) => setEditProductState({ ...editProductState, name: e.target.value })}
                                    className="w-full bg-white border border-sand px-2 py-1.5 rounded-lg text-stone-800"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold uppercase text-stone-450">Price (INR)</label>
                                  <input
                                    type="number"
                                    required
                                    value={editProductState.price}
                                    onChange={(e) => setEditProductState({ ...editProductState, price: Number(e.target.value) })}
                                    className="w-full bg-white border border-sand px-2 py-1.5 rounded-lg text-stone-800"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold uppercase text-stone-450">Stock</label>
                                  <input
                                    type="number"
                                    required
                                    value={editProductState.stock}
                                    onChange={(e) => setEditProductState({ ...editProductState, stock: Number(e.target.value) })}
                                    className="w-full bg-white border border-sand px-2 py-1.5 rounded-lg text-stone-800"
                                  />
                                </div>
                                <div className="flex gap-2 items-end">
                                  <button
                                    type="submit"
                                    className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-lg"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingProdId(null)}
                                    className="flex-1 border border-sand text-stone-500 py-2 rounded-lg"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </td>
                          </tr>
                        ) : (
                          // Standard Product display Row
                          <tr className="hover:bg-sand-light/10">
                            <td className="py-4">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-sand-light/50 border border-sand/20">
                                <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="font-product font-semibold text-stone-800 dark:text-stone-200">{prod.name}</div>
                              <div className="text-[10px] text-stone-400 font-mono">ID: {prod.id}</div>
                            </td>
                            <td className="py-4">{prod.category}</td>
                            <td className="py-4 font-serif font-bold text-maroon dark:text-gold">{formatCurrency(prod.price)}</td>
                            <td className="py-4">
                              {prod.stock > 0 ? (
                                <span className="text-emerald-700 dark:text-emerald-450 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full text-[10px]">
                                  {prod.stock} In Stock
                                </span>
                              ) : (
                                <span className="text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/20 px-2.5 py-0.5 rounded-full text-[10px]">
                                  Sold Out
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-right space-x-2">
                              <button
                                onClick={() => handleStartEdit(prod)}
                                className="p-2 rounded-lg border border-sand hover:bg-stone-50 text-stone-500 hover:text-maroon transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(prod.id)}
                                className="p-2 rounded-lg border border-sand hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: Customer Records */}
          {activeTab === "customers" && (
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-sand/15 text-stone-400 uppercase tracking-wider text-[9px] font-bold">
                    <th className="pb-3">Client Profile</th>
                    <th className="pb-3">Contact Details</th>
                    <th className="pb-3">Order Counts</th>
                    <th className="pb-3">Accumulated Spend</th>
                    <th className="pb-3 text-right">Loyalty Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/10">
                  {customerList.map((cust, idx) => (
                    <tr key={idx} className="hover:bg-sand-light/10">
                      <td className="py-4">
                        <div className="font-bold text-stone-850 dark:text-stone-200">{cust.name}</div>
                        <div className="text-[10px] text-stone-400">Customer since 2026</div>
                      </td>
                      <td className="py-4">
                        <div>{cust.email}</div>
                        <div className="text-[10px] text-stone-400">Phone: {cust.phone}</div>
                      </td>
                      <td className="py-4 font-bold">{cust.ordersCount} checkouts</td>
                      <td className="py-4 font-serif font-bold text-maroon dark:text-gold">{formatCurrency(cust.totalSpent)}</td>
                      <td className="py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          cust.totalSpent >= 200 
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400"
                            : cust.totalSpent >= 100
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                              : "bg-stone-50 text-stone-650 dark:bg-stone-900/20 dark:text-stone-400"
                        }`}>
                          {cust.totalSpent >= 200 ? "Diamond VIP" : cust.totalSpent >= 100 ? "Gold Status" : "Atelier Collector"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </main>

      <Footer />
    </>
  );
}
