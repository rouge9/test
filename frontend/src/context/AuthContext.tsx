// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import { VITE_BACKEND_API } from "@/queries/api";

interface AuthContextType {
  user: User;
  token: string | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const queryClient = useQueryClient();

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${VITE_BACKEND_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if the response is okay (status code 200-299)
      if (!response.ok) {
        const errorText = await response.text(); // Get the error message
        throw new Error(`Login failed: ${errorText}`);
      }

      const data = await response.json();
      setUser(data.userWithoutPassword);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userWithoutPassword._id);
      localStorage.setItem("username", data.userWithoutPassword.username);
      window.location.href = "/";
    } catch (error) {
      console.error("Error during login:", error);
      throw error; // Rethrow or handle the error as needed
    }
  };
  const register = async (username: string, password: string) => {
    try {
      const response = await fetch(`${VITE_BACKEND_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Registration failed: ${errorText}`);
      }

      // Optionally log in the user immediately after registration
      await login(username, password);
    } catch (error) {
      console.error("Error during registration:", error);
      throw error; // Rethrow or handle the error as needed
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    queryClient.clear(); // Clear any cached data
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
