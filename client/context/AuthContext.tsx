"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error?: unknown;
}

// Fournir une valeur initiale au createContext
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: undefined,
});

export const AuthProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchAuth = async () => {
    const response = await axios.get(`${BASE_URL}/auth/status`, {
      withCredentials: true,
    });
    return response.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["authStatus"],
    queryFn: fetchAuth,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setIsAuthenticated(data?.isAuthenticated);
    }
  }, [data]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
