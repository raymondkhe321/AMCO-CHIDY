import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('amco_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'amco_user') {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null;
          setUser(newUser);
        } catch {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Admin credentials
      if (email === 'admin@amcochidy.com' && password === 'Admin@2025') {
        const adminUser: User = {
          id: 'admin-1',
          email,
          role: 'admin',
          name: 'Admin'
        };
        setUser(adminUser);
        localStorage.setItem('amco_user', JSON.stringify(adminUser));
        // Trigger storage event manually for same window
        window.dispatchEvent(new Event('auth-change'));
        return true;
      }

      // Customer login
      const customers = JSON.parse(localStorage.getItem('amco_customers') || '[]');
      const customer = customers.find((c: any) => c.email === email && c.password === password);
      
      if (customer) {
        const customerUser: User = {
          id: customer.id,
          email: customer.email,
          role: 'customer',
          name: customer.name
        };
        setUser(customerUser);
        localStorage.setItem('amco_user', JSON.stringify(customerUser));
        // Trigger storage event manually for same window
        window.dispatchEvent(new Event('auth-change'));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const customers = JSON.parse(localStorage.getItem('amco_customers') || '[]');
      
      if (customers.some((c: any) => c.email === email)) {
        return false;
      }

      const newCustomer = {
        id: `customer-${Date.now()}`,
        email,
        password,
        name
      };

      customers.push(newCustomer);
      localStorage.setItem('amco_customers', JSON.stringify(customers));

      const customerUser: User = {
        id: newCustomer.id,
        email: newCustomer.email,
        role: 'customer',
        name: newCustomer.name
      };
      setUser(customerUser);
      localStorage.setItem('amco_user', JSON.stringify(customerUser));
      // Trigger storage event manually for same window
      window.dispatchEvent(new Event('auth-change'));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('amco_user');
    // Trigger storage event manually for same window
    window.dispatchEvent(new Event('auth-change'));
    // Force page reload to clear all state
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
