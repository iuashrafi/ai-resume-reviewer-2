"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CookieNames } from "@/types/enum";
import { api } from "@/lib/api";
import { User } from "@/types/auth.types";

interface AuthContextType {
  user: User | null;
  loadingUser: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/api/auth/profile`);
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
      Cookies.remove(CookieNames.jwtToken);
    } finally {
      setLoadingUser(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post(`/api/auth/login`, { email, password });
    Cookies.set(CookieNames.jwtToken, response.data.token, { expires: 7 });
    setUser(response.data.userData);
    router.push("/dashboard");
  };

  const logout = () => {
    Cookies.remove(CookieNames.jwtToken);
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    console.log("user=", user);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loadingUser, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
