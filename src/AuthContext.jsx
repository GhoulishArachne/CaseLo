import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "./supabaseService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const getSession = async () => {
      const { session, error: sessionError } = await authService.getSession();
      if (sessionError) {
        setError(sessionError.message);
      }
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const { data } = authService.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
    });

    return () => {
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, []);

  const signup = async (email, password) => {
    setLoading(true);
    setError(null);
    const { data, error } = await authService.signup(email, password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
    return { data, error };
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const { data, error } = await authService.login(email, password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
    return { data, error };
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    const { error } = await authService.logout();
    if (error) {
      setError(error.message);
    }
    setUser(null);
    setSession(null);
    setLoading(false);
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
