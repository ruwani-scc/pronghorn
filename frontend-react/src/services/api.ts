import axios from 'axios';
import type {
  Itinerary,
  Accommodation,
  Activity,
  Transport,
  CreateItineraryDTO,
  UpdateItineraryDTO,
  CreateAccommodationDTO,
  UpdateAccommodationDTO,
  CreateActivityDTO,
  UpdateActivityDTO,
  CreateTransportDTO,
  UpdateTransportDTO,
} from '../types';

const api = axios.create({
  baseURL: '/api/v1', // Use relative path to leverage Vite proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No auth token found. Request may fail with 401. Authenticate first using: await window.auth.initializeTestAuth()');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to unwrap ApiResponse and handle errors
api.interceptors.response.use(
  (response) => {
    // Unwrap ApiResponse<T> wrapper from backend
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      const apiResponse = response.data as { success: boolean; data: any; message?: string; errors?: any };
      if (apiResponse.success) {
        // Replace response.data with the unwrapped data
        response.data = apiResponse.data;
      } else {
        // If not successful, throw an error
        const error = new Error(apiResponse.message || 'API request failed');
        (error as any).response = {
          ...response,
          data: apiResponse.errors || apiResponse.message,
        };
        (error as any).status = response.status;
        return Promise.reject(error);
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token
      const hadToken = !!localStorage.getItem('authToken');
      localStorage.removeItem('authToken');
      
      if (hadToken) {
        console.error('❌ 401 Unauthorized: Token expired or invalid. Please re-authenticate.');
      } else {
        console.error('❌ 401 Unauthorized: No authentication token. Please authenticate first.');
        console.log('💡 Run in console: await window.auth.initializeTestAuth()');
      }
    }
    return Promise.reject(error);
  }
);

// Itinerary API
export const itineraryApi = {
  getAll: async (): Promise<Itinerary[]> => {
    const response = await api.get<{ data: Itinerary[]; count: number }>('/itineraries');
    // Backend returns ListResponse<T> which has { data: T[], count: number }
    return response.data.data || response.data;
  },

  getById: async (id: string): Promise<Itinerary> => {
    const response = await api.get<Itinerary>(`/itineraries/${id}`);
    return response.data;
  },

  create: async (data: CreateItineraryDTO): Promise<Itinerary> => {
    const response = await api.post<Itinerary>('/itineraries', data);
    return response.data;
  },

  update: async (id: string, data: UpdateItineraryDTO): Promise<Itinerary> => {
    const response = await api.put<Itinerary>(`/itineraries/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/itineraries/${id}`);
  },
};

// Accommodation API (uses items endpoint with category filter)
export const accommodationApi = {
  getByItinerary: async (itineraryId: string): Promise<Accommodation[]> => {
    const response = await api.get<{ data: Accommodation[]; count: number }>(
      `/itineraries/${itineraryId}/items?category=accommodation`
    );
    return response.data.data || response.data;
  },

  getById: async (id: string): Promise<Accommodation> => {
    const response = await api.get<Accommodation>(`/items/${id}`);
    return response.data;
  },

  create: async (data: CreateAccommodationDTO): Promise<Accommodation> => {
    const response = await api.post<Accommodation>('/itineraries/' + (data as any).itineraryId + '/items', {
      ...data,
      category: 'accommodation',
    });
    return response.data;
  },

  update: async (id: string, data: UpdateAccommodationDTO): Promise<Accommodation> => {
    const response = await api.put<Accommodation>(`/items/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
};

// Activity API (uses items endpoint with category filter)
export const activityApi = {
  getByItinerary: async (itineraryId: string): Promise<Activity[]> => {
    const response = await api.get<{ data: Activity[]; count: number }>(
      `/itineraries/${itineraryId}/items?category=activity`
    );
    return response.data.data || response.data;
  },

  getById: async (id: string): Promise<Activity> => {
    const response = await api.get<Activity>(`/items/${id}`);
    return response.data;
  },

  create: async (data: CreateActivityDTO): Promise<Activity> => {
    const response = await api.post<Activity>('/itineraries/' + (data as any).itineraryId + '/items', {
      ...data,
      category: 'activity',
    });
    return response.data;
  },

  update: async (id: string, data: UpdateActivityDTO): Promise<Activity> => {
    const response = await api.put<Activity>(`/items/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
};

// Transport API (uses items endpoint with category filter)
export const transportApi = {
  getByItinerary: async (itineraryId: string): Promise<Transport[]> => {
    const response = await api.get<{ data: Transport[]; count: number }>(
      `/itineraries/${itineraryId}/items?category=transport`
    );
    return response.data.data || response.data;
  },

  getById: async (id: string): Promise<Transport> => {
    const response = await api.get<Transport>(`/items/${id}`);
    return response.data;
  },

  create: async (data: CreateTransportDTO): Promise<Transport> => {
    const response = await api.post<Transport>('/itineraries/' + (data as any).itineraryId + '/items', {
      ...data,
      category: 'transport',
    });
    return response.data;
  },

  update: async (id: string, data: UpdateTransportDTO): Promise<Transport> => {
    const response = await api.put<Transport>(`/items/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
};

export default api;
