import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { City, ServiceFamily, Category, PricingPlan, FAQ, ProProfile, Review, LeaderboardEntry } from '@/types';

// ========== CITIES ==========
export const useCities = () => {
  return useQuery<City[]>({
    queryKey: ['cities'],
    queryFn: async () => {
      const res = await api.get('/cities');
      return res.data.data;
    },
  });
};

export const useCity = (id: string) => {
  return useQuery<City>({
    queryKey: ['city', id],
    queryFn: async () => {
      const res = await api.get(`/cities/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

// ========== FAMILIES & CATEGORIES ==========
export const useFamilies = () => {
  return useQuery<ServiceFamily[]>({
    queryKey: ['families'],
    queryFn: async () => {
      const res = await api.get('/families');
      return res.data.data;
    },
  });
};

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });
};

// ========== PROFESSIONALS ==========
export const usePros = (filters?: Record<string, any>) => {
  return useQuery<{ data: ProProfile[]; pagination: any }>({
    queryKey: ['pros', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) params.append(key, String(value));
        });
      }
      const res = await api.get(`/pros?${params}`);
      return res.data;
    },
  });
};

export const useFeaturedPros = () => {
  return useQuery<ProProfile[]>({
    queryKey: ['featured-pros'],
    queryFn: async () => {
      const res = await api.get('/pros/featured');
      return res.data.data;
    },
  });
};

export const useLeaderboard = (filters?: { categoryId?: string; cityId?: string; period?: string }) => {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.cityId) params.append('cityId', filters.cityId);
      if (filters?.period) params.append('period', filters.period);
      const res = await api.get(`/pros/leaderboard?${params}`);
      return res.data.data;
    },
  });
};

export const useProDetail = (id: string) => {
  return useQuery<ProProfile & { reviews: Review[] }>({
    queryKey: ['pro', id],
    queryFn: async () => {
      const res = await api.get(`/pros/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

// ========== REVIEWS ==========
export const useProReviews = (proId: string) => {
  return useQuery<{ data: Review[]; stats: any }>({
    queryKey: ['reviews', proId],
    queryFn: async () => {
      const res = await api.get(`/reviews/pro/${proId}`);
      return res.data;
    },
    enabled: !!proId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/reviews', data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.proId] });
      queryClient.invalidateQueries({ queryKey: ['pro', variables.proId] });
    },
  });
};

// ========== PRICING ==========
export const usePricingPlans = () => {
  return useQuery<PricingPlan[]>({
    queryKey: ['pricing-plans'],
    queryFn: async () => {
      const res = await api.get('/pricing/plans');
      return res.data.data;
    },
  });
};

// ========== FAQ ==========
export const useFAQs = (category?: string) => {
  return useQuery<FAQ[]>({
    queryKey: ['faqs', category],
    queryFn: async () => {
      const res = await api.get('/faqs');
      return res.data.data;
    },
  });
};
