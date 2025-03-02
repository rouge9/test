// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";

interface AuthContextType {
  user: User;
  token: string | null;
  role: string | null;
  refreshToken: string | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshTokenHandler: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  const queryClient = useQueryClient();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      // Check if the response is okay (status code 200-299)
      if (!response.ok) {
        const errorText = await response.text(); // Get the error message
        throw new Error(`Login failed: ${errorText}`);
      }

      const data = await response.json();
      console.log(data);
      setUser(data);
      setToken(data.token);
      setRefreshToken(data.refreshToken);
      setRole(data.role);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("role", data.userRole);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.location.href = "/";
    } catch (error) {
      console.error("Error during login:", error);
      throw error; // Rethrow or handle the error as needed
    }
  };
  const register = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Registration failed: ${errorText}`);
      }

      // Optionally log in the user immediately after registration
      await login(email, password);
    } catch (error) {
      console.error("Error during registration:", error);
      throw error; // Rethrow or handle the error as needed
    }
  };

  const refreshTokenHandler = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: refreshToken }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Refresh token failed: ${errorText}`);
      }

      const data = await response.json();
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    } catch (error) {
      console.error("Error during token refresh:", error);
      throw error; // Rethrow or handle the error as needed
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    setRefreshToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");
    queryClient.clear(); // Clear any cached data
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        refreshToken,
        login,
        logout,
        register,
        refreshTokenHandler,
      }}
    >
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
