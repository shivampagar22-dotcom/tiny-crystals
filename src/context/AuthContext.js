"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth, isMock } from "@/lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    if (!isMock || typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("nomiki_current_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(() => !isMock);
  const [error, setError] = useState(null);

  // Helper for localStorage mock users
  const getMockUsers = () => {
    if (typeof window === "undefined") return [];
    const users = localStorage.getItem("nomiki_mock_users");
    return users ? JSON.parse(users) : [
      { email: "admin@tinycrystals.com", password: "admin123", displayName: "Artisan Ganga", role: "admin", uid: "mock-admin-uid" },
      { email: "guest@example.com", password: "password123", displayName: "Jane Doe", role: "user", uid: "mock-guest-uid" }
    ];
  };

  const saveMockUsers = (users) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("nomiki_mock_users", JSON.stringify(users));
  };

  useEffect(() => {
    if (!isMock && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Check if admin
          const isAdmin = user.email === "admin@tinycrystals.com";
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split("@")[0],
            role: isAdmin ? "admin" : "user",
          });
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    }
  }, []);

  const register = async (email, password, displayName) => {
    setError(null);
    setLoading(true);
    try {
      if (!isMock && auth) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const isAdmin = email === "admin@tinycrystals.com";
        const userObj = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: displayName || email.split("@")[0],
          role: isAdmin ? "admin" : "user",
        };
        setCurrentUser(userObj);
        setLoading(false);
        return userObj;
      } else {
        // Mock Register
        const users = getMockUsers();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("Email already in use.");
        }
        const newUser = {
          uid: "mock-uid-" + Math.random().toString(36).substr(2, 9),
          email: email.toLowerCase(),
          password, // for mock lookup
          displayName,
          role: email.toLowerCase() === "admin@tinycrystals.com" ? "admin" : "user"
        };
        users.push(newUser);
        saveMockUsers(users);
        
        // Log in the new user
        const loggedUser = { uid: newUser.uid, email: newUser.email, displayName: newUser.displayName, role: newUser.role };
        localStorage.setItem("nomiki_current_user", JSON.stringify(loggedUser));
        setCurrentUser(loggedUser);
        setLoading(false);
        return loggedUser;
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      if (!isMock && auth) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const isAdmin = email === "admin@tinycrystals.com";
        const userObj = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName || email.split("@")[0],
          role: isAdmin ? "admin" : "user",
        };
        setCurrentUser(userObj);
        setLoading(false);
        return userObj;
      } else {
        // Mock Login
        const users = getMockUsers();
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!found) {
          throw new Error("Invalid email or password.");
        }
        const loggedUser = { uid: found.uid, email: found.email, displayName: found.displayName, role: found.role };
        localStorage.setItem("nomiki_current_user", JSON.stringify(loggedUser));
        setCurrentUser(loggedUser);
        setLoading(false);
        return loggedUser;
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isMock && auth) {
        await signOut(auth);
      } else {
        localStorage.removeItem("nomiki_current_user");
      }
      setCurrentUser(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isMock && auth) {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        const isAdmin = credential.user.email === "admin@tinycrystals.com";
        const userObj = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          role: isAdmin ? "admin" : "user",
        };
        setCurrentUser(userObj);
        setLoading(false);
        return userObj;
      } else {
        // Mock Google Login
        const mockGoogleUser = {
          uid: "mock-google-uid-12345",
          email: "jane.google@example.com",
          displayName: "Jane Google",
          role: "user"
        };
        localStorage.setItem("nomiki_current_user", JSON.stringify(mockGoogleUser));
        setCurrentUser(mockGoogleUser);
        setLoading(false);
        return mockGoogleUser;
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, register, login, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
