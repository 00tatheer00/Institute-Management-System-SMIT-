"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { UserRole } from "@/lib/types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

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
  isSupabaseConnected: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => Promise<void>;
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
    isLoading: true,
    isSupabaseConnected: false,
  });

  // Check Supabase session on mount
  useEffect(() => {
    const configured = isSupabaseConfigured();

    if (!configured) {
      // Offline / demo preview mode default: restore last demo session or set unauthenticated
      const savedDemo = typeof window !== "undefined" ? localStorage.getItem("mhit_demo_user") : null;
      if (savedDemo && demoUsers[savedDemo as UserRole]) {
        setState({
          user: demoUsers[savedDemo as UserRole],
          isAuthenticated: true,
          isLoading: false,
          isSupabaseConnected: false,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isSupabaseConnected: false,
        });
      }
      return;
    }

    const supabase = getSupabaseBrowserClient();

    async function syncSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session?.user) {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isSupabaseConnected: true,
          });
          return;
        }

        // Fetch verified user profile from database
        const { data: profile } = (await supabase
          .from("profiles")
          .select("id, name, email, role, avatar_url")
          .eq("id", session.user.id)
          .single()) as { data: any; error: any };

        const authUser: AuthUser = {
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
          email: session.user.email || profile?.email || "",
          role: (profile?.role as UserRole) || "student",
          avatar: profile?.avatar_url || undefined,
        };

        setState({
          user: authUser,
          isAuthenticated: true,
          isLoading: false,
          isSupabaseConnected: true,
        });
      } catch (err) {
        console.error("Failed to sync Supabase session:", err);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }

    syncSession();

    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (session?.user) {
        const { data: profile } = (await supabase
          .from("profiles")
          .select("id, name, email, role, avatar_url")
          .eq("id", session.user.id)
          .single()) as { data: any; error: any };

        setState({
          user: {
            id: session.user.id,
            name: profile?.name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
            email: session.user.email || "",
            role: (profile?.role as UserRole) || "student",
            avatar: profile?.avatar_url || undefined,
          },
          isAuthenticated: true,
          isLoading: false,
          isSupabaseConnected: true,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isSupabaseConnected: true,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    if (!isSupabaseConfigured()) {
      // Offline fallback: find matching demo user or default to admin
      await new Promise((r) => setTimeout(r, 600));
      const foundRole = (Object.keys(demoUsers) as UserRole[]).find(
        (r) => demoUsers[r].email.toLowerCase() === email.toLowerCase()
      );
      const user = foundRole ? demoUsers[foundRole] : demoUsers.admin;

      if (typeof window !== "undefined") {
        localStorage.setItem("mhit_demo_user", user.role);
      }

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        isSupabaseConnected: false,
      });
      return { success: true, role: user.role };
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        let friendlyMessage = "Invalid credentials. Please verify your email and password.";
        if (error.message.toLowerCase().includes("email not confirmed")) {
          friendlyMessage = "Your email address is not yet confirmed. Please check your inbox.";
        } else if (error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("too many")) {
          friendlyMessage = "Too many login attempts. Please wait a moment before trying again.";
        }
        return { success: false, error: friendlyMessage };
      }

      let userRole: UserRole = "student";

      if (data.user) {
        const { data: profile } = (await supabase
          .from("profiles")
          .select("id, name, email, role, avatar_url")
          .eq("id", data.user.id)
          .single()) as { data: any; error: any };

        userRole = (profile?.role as UserRole) || "student";

        setState({
          user: {
            id: data.user.id,
            name: profile?.name || data.user.email?.split("@")[0] || "User",
            email: data.user.email || "",
            role: userRole,
            avatar: profile?.avatar_url || undefined,
          },
          isAuthenticated: true,
          isLoading: false,
          isSupabaseConnected: true,
        });
      }

      return { success: true, role: userRole };
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: "Unable to sign in due to a network or server issue. Please try again shortly.",
      };
    }
  }, []);

  const loginAsDemo = useCallback((role: UserRole) => {
    if (isSupabaseConfigured()) {
      console.warn("loginAsDemo is disabled when Supabase production auth is configured.");
      return;
    }
    const user = demoUsers[role];
    if (typeof window !== "undefined") {
      localStorage.setItem("mhit_demo_user", role);
    }
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      isSupabaseConnected: false,
    });
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("mhit_demo_user");
    }
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isSupabaseConnected: isSupabaseConfigured(),
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
