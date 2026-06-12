import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  activeSection: string;
  scrollY: number;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setActiveSection: (section: string) => void;
  setScrollY: (y: number) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  activeSection: '',
  scrollY: 0,
  toast: null,

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setActiveSection: (section) => set({ activeSection: section }),
  setScrollY: (y) => set({ scrollY: y }),
  showToast: (message, type) => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));
