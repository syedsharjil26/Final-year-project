import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, User } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login function (Supabase)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Sign in with Supabase Auth
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      const userId = signInData.user?.id;
      if (!userId) throw new Error('User ID not returned from signIn');

      // 2. Fetch user profile from 'users' table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (profileError) throw profileError;
      if (!userProfile) throw new Error('User profile not found');

      setUser(userProfile);
      localStorage.setItem('user', JSON.stringify(userProfile));
      toast.success('Login successful!');
      return userProfile; // <-- Return user profile for redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      toast.error(err instanceof Error ? err.message : 'Login failed');
      throw err; // <-- Rethrow so LoginPage can handle
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: 'student' | 'homeowner' | 'admin') => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Sign up user with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      const userId = signUpData.user?.id;
      if (!userId) throw new Error('User ID not returned from signUp');

      // 2. Insert user profile into 'users' table
      const { error: insertError } = await supabase.from('users').insert([
        { id: userId, name, email, role }
      ]);
      if (insertError) throw insertError;

      // 3. Set user in state (optional: fetch user profile)
      setUser({ id: userId, name, email, role });
      localStorage.setItem('user', JSON.stringify({ id: userId, name, email, role }));
      toast.success('Registration successful!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}