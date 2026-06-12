// ==================== AUTH ====================

export interface User {
  id: string;
  email: string;
  role: 'client' | 'pro' | 'moderator' | 'admin';
  phone: string | null;
  avatar: string | null;
  status: string;
  createdAt: string;
  cityId: string | null;
  proProfile?: ProProfile;
  clientProfile?: ClientProfile;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

// ==================== PRO PROFILE ====================

export interface ProProfile {
  id: string;
  userId: string;
  title: string | null;
  bio: string | null;
  avatar: string | null;
  coverPhoto: string | null;
  yearsExperience: number;
  languages: string[];
  proScore: number;
  avgRating: number;
  totalReviews: number;
  totalMissions: number;
  responseRate: number;
  responseTimeHours: number;
  primarySkills: string[];
  secondarySkills: string[];
  level: 'starter' | 'certified' | 'expert' | 'elite' | 'partner';
  profileCompletion: number;
  hourlyRateMin: number | null;
  hourlyRateMax: number | null;
  availability: Record<string, any> | null;
  isAvailableNow: boolean;
  isVerified: boolean;
  isActive: boolean;
  categoryId: string | null;
  category?: Category;
  cityId: string | null;
  city?: City;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  preferences: Record<string, any> | null;
}

// ==================== CITY ====================

export interface City {
  id: string;
  name: string;
  slug: string;
  region: string;
  population: number | null;
  prosCount: number;
  categoriesCount: number;
  neighborhoodsCount: number;
  image: string | null;
  description: string | null;
  topCategories: string[];
  isActive: boolean;
  phase: number;
}

// ==================== CATEGORY & FAMILY ====================

export interface ServiceFamily {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  description: string | null;
  prosCount: number;
  order: number;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  prosCount: number;
  familyId: string;
  family?: ServiceFamily;
  order: number;
}

// ==================== REVIEW ====================

export interface Review {
  id: string;
  proId: string;
  clientId: string;
  client?: { id: string; email: string; avatar: string | null };
  missionId: string | null;
  qualityScore: number;
  punctualityScore: number;
  communicationScore: number;
  valueScore: number;
  professionalismScore: number;
  overallScore: number;
  comment: string | null;
  isVerified: boolean;
  proResponse: string | null;
  proResponseAt: string | null;
  createdAt: string;
}

// ==================== PRICING ====================

export interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  priceXaf: number;
  commissionPercent: number;
  contactsLimit: number;
  boostsPerMonth: number;
  features: { name: string; included: boolean }[];
  description: string | null;
  isPopular: boolean;
  order: number;
}

// ==================== LEADERBOARD ====================

export interface LeaderboardEntry {
  id: string;
  proId: string;
  pro?: ProProfile & { user: { id: string; avatar: string | null } };
  categoryId: string | null;
  cityId: string | null;
  period: string;
  rank: number;
  previousRank: number | null;
  proScore: number;
  totalMissions: number;
  totalReviews: number;
}

// ==================== NOTIFICATION ====================

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  data: Record<string, any> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

// ==================== FAQ ====================

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

// ==================== UI ====================

export interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

// ==================== API RESPONSE ====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
