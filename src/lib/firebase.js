import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { initialProducts } from "./productsData";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if credentials exist
const isFirebaseConfigured =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let app;
let auth;
let db;
let isMock = true;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isMock = false;
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.warn("Firebase initialization failed, falling back to Mock Driver:", error);
  }
} else {
  console.log("Firebase environment variables missing. Running in Mock localStorage mode.");
}

// Custom mock implementations that simulate database behaviors via localStorage
const getLocalStorageData = (key, initialValue) => {
  if (typeof window === "undefined") return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    return initialValue;
  }
};

const setLocalStorageData = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

export { auth, db, isMock };

const legacyInrPrices = {
  n1: 2499,
  b1: 1899,
  e1: 2199,
  r1: 899,
  c1: 3499,
  n2: 4999,
  b2: 1299,
  e2: 1999,
};

const normalizeLegacyProductPrices = (products) => {
  if (!Array.isArray(products)) return products;
  return products.map((product) => {
    const inrPrice = legacyInrPrices[product.id];
    if (inrPrice && Number(product.price) < 1000) {
      return { ...product, price: inrPrice };
    }
    return product;
  });
};

const normalizeLegacyOrderPrices = (orders) => {
  if (!Array.isArray(orders)) return orders;
  return orders.map((order) => {
    const updatedItems = (order.items || []).map((item) => {
      const inrPrice = legacyInrPrices[item.id];
      if (inrPrice && Number(item.price) < 1000) {
        return { ...item, price: inrPrice };
      }
      return item;
    });

    const subtotal = updatedItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    const legacyOrderTotal = Number(order.total || 0) < 1000;

    if (!legacyOrderTotal) {
      return { ...order, items: updatedItems };
    }

    const discountPercent =
      order.subtotal && order.discount ? Number(order.discount) / Number(order.subtotal) : 0;
    const discount = Math.round(subtotal * discountPercent);

    return {
      ...order,
      items: updatedItems,
      subtotal,
      discount,
      total: subtotal - discount,
    };
  });
};

// Simulated APIs (Mock backend wrapper)
export const mockDb = {
  // Products API
  getProducts: () => {
    // Seed default data if empty
    const local = getLocalStorageData("nomiki_products", null);
    if (!local) {
      const { initialProducts } = require("./productsData");
      setLocalStorageData("nomiki_products", initialProducts);
      return initialProducts;
    }
    const normalized = normalizeLegacyProductPrices(local);
    if (JSON.stringify(normalized) !== JSON.stringify(local)) {
      setLocalStorageData("nomiki_products", normalized);
    }
    return normalized;
  },
  saveProducts: (products) => {
    setLocalStorageData("nomiki_products", products);
  },

  // Orders API
  getOrders: () => {
    const initialOrders = [
      {
        id: "ord-1001",
        customer: { name: "Sophia L.", email: "sophia@example.com", phone: "+91 98765 43210", address: "123 Creme St", city: "Mumbai", postal: "400001" },
        items: [
          { id: "n1", name: "Aura Seed Bead Choker", price: 2499, quantity: 1 }
        ],
        subtotal: 2499,
        discount: 250,
        total: 2249,
        status: "Pending",
        paymentMethod: "Razorpay (Simulated)",
        createdAt: "2026-05-28T14:32:00.000Z"
      },
      {
        id: "ord-1002",
        customer: { name: "Elena R.", email: "elena@example.com", phone: "+91 91234 56789", address: "456 Rosewood Ave", city: "Bangalore", postal: "560001" },
        items: [
          { id: "e1", name: "Dusty Pink Pearl Drop Earrings", price: 2199, quantity: 2 }
        ],
        subtotal: 4398,
        discount: 0,
        total: 4398,
        status: "Shipped",
        paymentMethod: "Razorpay (Simulated)",
        createdAt: "2026-05-27T09:15:00.000Z"
      }
    ];
    const local = getLocalStorageData("nomiki_orders", null);
    if (!local) {
      setLocalStorageData("nomiki_orders", initialOrders);
      return initialOrders;
    }
    const normalized = normalizeLegacyOrderPrices(local);
    if (JSON.stringify(normalized) !== JSON.stringify(local)) {
      setLocalStorageData("nomiki_orders", normalized);
    }
    return normalized;
  },
  saveOrders: (orders) => {
    setLocalStorageData("nomiki_orders", orders);
  },

  // Customers API (derived from orders and mock profiles)
  getCustomers: () => {
    const localOrders = mockDb.getOrders();
    const customersMap = new Map();

    // Add default users
    customersMap.set("sophia@example.com", {
      name: "Sophia L.",
      email: "sophia@example.com",
      phone: "+91 98765 43210",
      ordersCount: 1,
      totalSpent: 2249
    });

    customersMap.set("elena@example.com", {
      name: "Elena R.",
      email: "elena@example.com",
      phone: "+91 91234 56789",
      ordersCount: 1,
      totalSpent: 4398
    });

    localOrders.forEach(o => {
      if (o.customer && o.customer.email) {
        const exist = customersMap.get(o.customer.email) || {
          name: o.customer.name,
          email: o.customer.email,
          phone: o.customer.phone || "N/A",
          ordersCount: 0,
          totalSpent: 0
        };
        exist.ordersCount += 1;
        exist.totalSpent += o.total;
        customersMap.set(o.customer.email, exist);
      }
    });

    return Array.from(customersMap.values());
  }
};

const productCollection = () => collection(db, "products");
const orderCollection = () => collection(db, "orders");

const fromSnapshot = (snapshot) => snapshot.docs.map((document) => document.data());

const getInitialOrders = () => [
  {
    id: "ord-1001",
    customer: { name: "Sophia L.", email: "sophia@example.com", phone: "+91 98765 43210", address: "123 Creme St", city: "Mumbai", postal: "400001" },
    items: [
      { id: "n1", name: "Aura Seed Bead Choker", price: 2499, quantity: 1 }
    ],
    subtotal: 2499,
    discount: 250,
    total: 2249,
    status: "Pending",
    paymentMethod: "Razorpay (Simulated)",
    createdAt: "2026-05-28T14:32:00.000Z"
  },
  {
    id: "ord-1002",
    customer: { name: "Elena R.", email: "elena@example.com", phone: "+91 91234 56789", address: "456 Rosewood Ave", city: "Bangalore", postal: "560001" },
    items: [
      { id: "e1", name: "Dusty Pink Pearl Drop Earrings", price: 2199, quantity: 2 }
    ],
    subtotal: 4398,
    discount: 0,
    total: 4398,
    status: "Shipped",
    paymentMethod: "Razorpay (Simulated)",
    createdAt: "2026-05-27T09:15:00.000Z"
  }
];

const deriveCustomers = (orders) => {
  const customersMap = new Map();

  orders.forEach((order) => {
    if (!order.customer?.email) return;

    const existing = customersMap.get(order.customer.email) || {
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone || "N/A",
      ordersCount: 0,
      totalSpent: 0,
    };

    existing.ordersCount += 1;
    existing.totalSpent += Number(order.total || 0);
    customersMap.set(order.customer.email, existing);
  });

  return Array.from(customersMap.values());
};

export const firestoreDb = {
  getProducts: async () => {
    const snapshot = await getDocs(productCollection());
    const products = normalizeLegacyProductPrices(fromSnapshot(snapshot));

    if (products.length > 0) {
      return products;
    }

    const batch = writeBatch(db);
    initialProducts.forEach((product) => {
      batch.set(doc(db, "products", product.id), product);
    });
    await batch.commit();
    return initialProducts;
  },

  saveProducts: async (products) => {
    const existingSnapshot = await getDocs(productCollection());
    const batch = writeBatch(db);
    const incomingIds = new Set(products.map((product) => product.id));

    existingSnapshot.docs.forEach((document) => {
      if (!incomingIds.has(document.id)) {
        batch.delete(document.ref);
      }
    });

    products.forEach((product) => {
      batch.set(doc(db, "products", product.id), product);
    });

    await batch.commit();
  },

  deleteProduct: async (id) => {
    await deleteDoc(doc(db, "products", id));
  },

  getOrders: async () => {
    const snapshot = await getDocs(query(orderCollection(), orderBy("createdAt", "desc")));
    const orders = normalizeLegacyOrderPrices(fromSnapshot(snapshot));

    if (orders.length > 0) {
      return orders;
    }

    const initialOrders = getInitialOrders();
    const batch = writeBatch(db);
    initialOrders.forEach((order) => {
      batch.set(doc(db, "orders", order.id), order);
    });
    await batch.commit();
    return initialOrders;
  },

  saveOrders: async (orders) => {
    const existingSnapshot = await getDocs(orderCollection());
    const batch = writeBatch(db);
    const incomingIds = new Set(orders.map((order) => order.id));

    existingSnapshot.docs.forEach((document) => {
      if (!incomingIds.has(document.id)) {
        batch.delete(document.ref);
      }
    });

    orders.forEach((order) => {
      batch.set(doc(db, "orders", order.id), order);
    });

    await batch.commit();
  },

  getCustomers: async () => {
    const orders = await firestoreDb.getOrders();
    return deriveCustomers(orders);
  },
};

export const shopDb = isMock
  ? {
    getProducts: async () => mockDb.getProducts(),
    saveProducts: async (products) => mockDb.saveProducts(products),
    deleteProduct: async () => undefined,
    getOrders: async () => mockDb.getOrders(),
    saveOrders: async (orders) => mockDb.saveOrders(orders),
    getCustomers: async () => mockDb.getCustomers(),
  }
  : firestoreDb;
