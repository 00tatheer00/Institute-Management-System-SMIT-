"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { UserRole } from "@/lib/types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
}

const demoUsers: Record<UserRole, AuthUser> = {
  "super-admin": {
    id: "demo-super-admin",
    name: "Executive Director",
    email: "director@mhit.edu.pk",
    role: "super-admin",
  },
  admin: {
    id: "demo-admin",
    name: "Admin User",
    email: "admin@mhit.edu.pk",
    role: "admin",
  },
  trainer: {
    id: "trainer-1",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@mhit.edu.pk",
    role: "trainer",
  },
  student: {
    id: "student-1",
    name: "Muhammad Khan",
    email: "muhammad.khan@student.mhit.edu.pk",
    role: "student",
  },
  staff: {
    id: "staff-1",
    name: "Asif Ali",
    email: "asif.ali@mhit.edu.pk",
    role: "staff",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (_email: string, _password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    // In Phase 1, any login succeeds as admin demo
    setState({
      user: demoUsers.admin,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const loginAsDemo = useCallback((role: UserRole) => {
    setState({
      user: demoUsers[role],
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { demoUsers };
