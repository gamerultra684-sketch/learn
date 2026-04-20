'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { AuthUser } from './types';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
}

// ------------------------------------------------------------------
// Context
// ------------------------------------------------------------------
const AuthContext = createContext<AuthContextValue | null>(null);

// ------------------------------------------------------------------
// Provider
// ------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function loadInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    }

    async function handleSession(session: any) {
      if (session?.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (mounted) {
          if (profile) {
            setUser({
              id: profile.id,
              username: profile.username,
              email: session.user.email || '',
              avatar: profile.avatar_url,
              role: profile.role,
              // Maintain mock fields for UI compatibility until API is fully ready
              points: 0, 
              streak: 0,
              level: 1,
              joined_at: profile.created_at,
            } as any);
          } else {
            // Fallback if profile not created yet
            setUser({
              id: session.user.id,
              username: session.user.user_metadata?.username || 'User',
              email: session.user.email || '',
              avatar: session.user.user_metadata?.avatar_url,
              role: 'user',
            } as any);
          }
          setIsLoading(false);
        }
      } else {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    }

    loadInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      await handleSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // login function kept for compatibility if needed, but we use supabase.auth.signInWithPassword directly in pages
  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    router.refresh();
    return { ok: true };
  }, [supabase, router]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
    router.push('/login');
    router.refresh();
  }, [supabase, router]);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
