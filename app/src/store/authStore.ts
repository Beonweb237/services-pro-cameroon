import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<boolean>;
  registerClient: (data: RegisterClientData) => Promise<boolean>;
  registerPro: (data: RegisterProData) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  refreshToken: () => Promise<boolean>;
}

interface RegisterClientData {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  cityId?: string;
}

interface RegisterProData {
  email: string;
  password: string;
  phone: string;
  fullName: string;
  categoryId: string;
  cityId: string;
  title: string;
  bio?: string;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  languages?: string[];
  primarySkills?: string[];
  yearsExperience?: number;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          // Mode démo - connexion locale sans backend
          const demoAccounts: Record<string, { password: string; user: User }> = {
            'client@demo.com': {
              password: 'Demo1234',
              user: {
                id: 'demo-client-001',
                email: 'client@demo.com',
                role: 'client',
                phone: '+237 6XX XXX XXX',
                avatar: null,
                status: 'active',
                createdAt: new Date().toISOString(),
                cityId: 'douala',
                clientProfile: {
                  id: 'demo-cp-001',
                  userId: 'demo-client-001',
                  firstName: 'Jean',
                  lastName: 'Dupont',
                  address: 'Douala, Akwa',
                  preferences: {},
                },
              },
            },
            'pro@demo.com': {
              password: 'Demo1234',
              user: {
                id: 'demo-pro-001',
                email: 'pro@demo.com',
                role: 'pro',
                phone: '+237 6XX XXX XXX',
                avatar: null,
                status: 'active',
                createdAt: new Date().toISOString(),
                cityId: 'douala',
                proProfile: {
                  id: 'demo-pp-001',
                  userId: 'demo-pro-001',
                  title: 'Plombier Professionnel',
                  bio: 'Expert en plomberie résidentielle et commerciale avec plus de 10 ans d\'expérience.',
                  avatar: null,
                  coverPhoto: null,
                  yearsExperience: 10,
                  languages: ['Français', 'Anglais'],
                  proScore: 96,
                  avgRating: 4.9,
                  totalReviews: 48,
                  totalMissions: 156,
                  responseRate: 98,
                  responseTimeHours: 2,
                  primarySkills: ['Dépannage', 'Installation', 'Rénovation'],
                  secondarySkills: ['Chauffage', 'Pompe à chaleur'],
                  level: 'elite',
                  profileCompletion: 95,
                  hourlyRateMin: 5000,
                  hourlyRateMax: 25000,
                  availability: null,
                  isAvailableNow: true,
                  isVerified: true,
                  isActive: true,
                  categoryId: 'plomberie',
                  cityId: 'douala',
                  website: null,
                  facebook: null,
                  instagram: null,
                  linkedin: null,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              },
            },
            'admin@demo.com': {
              password: 'Demo1234',
              user: {
                id: 'demo-admin-001',
                email: 'admin@demo.com',
                role: 'admin',
                phone: '+237 6XX XXX XXX',
                avatar: null,
                status: 'active',
                createdAt: new Date().toISOString(),
                cityId: null,
              },
            },
          };

          const demo = demoAccounts[email.toLowerCase()];
          if (demo && demo.password === password) {
            const mockToken = 'demo-token-' + Date.now();
            set({ user: demo.user, accessToken: mockToken, isAuthenticated: true });
            return true;
          }

          const res = await api.post('/auth/login', { email, password });
          const { user, accessToken, refreshToken } = res.data.data;
          
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, isAuthenticated: true });
          return true;
        } catch (error: any) {
          console.error('Login error:', error);
          throw new Error(error.response?.data?.message || 'Erreur de connexion');
        }
      },

      registerClient: async (data) => {
        try {
          const res = await api.post('/auth/register/client', data);
          const { user, accessToken, refreshToken } = res.data.data;
          
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, isAuthenticated: true });
          return true;
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Erreur d\'inscription');
        }
      },

      registerPro: async (data) => {
        try {
          const res = await api.post('/auth/register/pro', data);
          const { user, accessToken, refreshToken } = res.data.data;
          
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, isAuthenticated: true });
          return true;
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Erreur d\'inscription');
        }
      },

      logout: () => {
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAccessToken: (token) => set({ accessToken: token }),

      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) return false;

          const res = await api.post('/auth/refresh', { refreshToken });
          const { accessToken } = res.data.data;
          set({ accessToken });
          return true;
        } catch {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);
