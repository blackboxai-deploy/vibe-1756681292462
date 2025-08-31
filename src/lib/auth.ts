'use client';

import { User, AuthState } from '@/types';

// Simple localStorage-based authentication for demo
// In production, use proper authentication service (Auth0, Supabase, etc.)

const AUTH_STORAGE_KEY = 'healthcare_ai_auth';
const USERS_STORAGE_KEY = 'healthcare_ai_users';

export class AuthService {
  // Get current authenticated user
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!authData) return null;
      
      const { userId } = JSON.parse(authData);
      const users = this.getUsers();
      return users.find(user => user.id === userId) || null;
    } catch {
      return null;
    }
  }

  // Login user
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      // Simple password check (in production, use proper hashing)
      if (password !== 'demo123') {
        return { success: false, error: 'Invalid password' };
      }
      
      // Store auth session
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        userId: user.id,
        timestamp: Date.now()
      }));
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    name: string;
    specialty?: string;
    credentials?: string;
    licenseNumber?: string;
    hospital?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      
      // Check if user already exists
      if (users.some(u => u.email === userData.email)) {
        return { success: false, error: 'User already exists' };
      }
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.name,
        specialty: userData.specialty,
        credentials: userData.credentials,
        licenseNumber: userData.licenseNumber,
        hospital: userData.hospital,
        createdAt: new Date()
      };
      
      users.push(newUser);
      this.saveUsers(users);
      
      // Auto-login after registration
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        userId: newUser.id,
        timestamp: Date.now()
      }));
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  // Logout user
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }
      
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);
      
      return { success: true, user: users[userIndex] };
    } catch (error) {
      return { success: false, error: 'Profile update failed' };
    }
  }

  // Get all users (for demo purposes)
  private getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const usersData = localStorage.getItem(USERS_STORAGE_KEY);
      return usersData ? JSON.parse(usersData) : this.getDefaultUsers();
    } catch {
      return this.getDefaultUsers();
    }
  }

  // Save users to localStorage
  private saveUsers(users: User[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  }

  // Default demo users
  private getDefaultUsers(): User[] {
    const defaultUsers: User[] = [
      {
        id: 'user_demo_1',
        email: 'doctor@hospital.com',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        credentials: 'MD, FACC',
        licenseNumber: 'MD123456',
        hospital: 'General Hospital',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'user_demo_2', 
        email: 'dr.smith@clinic.com',
        name: 'Dr. Michael Smith',
        specialty: 'Dermatology',
        credentials: 'MD, FAAD',
        licenseNumber: 'MD789012',
        hospital: 'Skin Care Clinic',
        createdAt: new Date('2024-01-01')
      }
    ];

    // Save default users if not exists
    if (typeof window !== 'undefined') {
      const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existingUsers) {
        this.saveUsers(defaultUsers);
      }
    }

    return defaultUsers;
  }
}

export const authService = new AuthService();

// Hook for authentication state (React hook)
export const useAuth = (): AuthState => {
  const [authState, setAuthState] = React.useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  React.useEffect(() => {
    const user = authService.getCurrentUser();
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: !!user
    });
  }, []);

  return authState;
};

// Import React for the hook
import React from 'react';