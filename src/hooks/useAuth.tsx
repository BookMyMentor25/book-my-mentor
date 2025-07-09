
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: (User & { isAdmin?: boolean }) | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<(User & { isAdmin?: boolean }) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to prevent deadlock when checking admin status
          setTimeout(async () => {
            try {
              const { data: adminData } = await supabase
                .from('admin_users')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              setUser({
                ...session.user,
                isAdmin: !!adminData
              });
            } catch (error) {
              console.log('Admin check failed:', error);
              setUser(session.user);
            }
          }, 0);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        try {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          setUser({
            ...session.user,
            isAdmin: !!adminData
          });
        } catch (error) {
          console.log('Admin check failed:', error);
          setUser(session.user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      console.log('Sign up attempt:', email, 'redirect:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });
      
      console.log('Sign up result:', { data, error });
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Sign in attempt:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Sign in result:', { data, error });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Sign out attempt');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Password reset attempt:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });
      console.log('Password reset result:', error);
      return { error };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
