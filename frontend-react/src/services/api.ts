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
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Itinerary API
export const itineraryApi = {
  getAll: async (): Promise<Itinerary[]> => {
    const response = await api.get<Itinerary[]>('/itineraries');
    return response.data;
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

// Accommodation API
export const accommodationApi = {
  getByItinerary: async (itineraryId: string): Promise<Accommodation[]> => {
    const response = await api.get<Accommodation[]>(`/itineraries/${itineraryId}/accommodations`);
    return response.data;
  },

  getById: async (id: string): Promise<Accommodation> => {
    const response = await api.get<Accommodation>(`/accommodations/${id}`);
    return response.data;
  },

  create: async (data: CreateAccommodationDTO): Promise<Accommodation> => {
    const response = await api.post<Accommodation>('/accommodations', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAccommodationDTO): Promise<Accommodation> => {
    const response = await api.put<Accommodation>(`/accommodations/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/accommodations/${id}`);
  },
};

// Activity API
export const activityApi = {
  getByItinerary: async (itineraryId: string): Promise<Activity[]> => {
    const response = await api.get<Activity[]>(`/itineraries/${itineraryId}/activities`);
    return response.data;
  },

  getById: async (id: string): Promise<Activity> => {
    const response = await api.get<Activity>(`/activities/${id}`);
    return response.data;
  },

  create: async (data: CreateActivityDTO): Promise<Activity> => {
    const response = await api.post<Activity>('/activities', data);
    return response.data;
  },

  update: async (id: string, data: UpdateActivityDTO): Promise<Activity> => {
    const response = await api.put<Activity>(`/activities/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/activities/${id}`);
  },
};

// Transport API
export const transportApi = {
  getByItinerary: async (itineraryId: string): Promise<Transport[]> => {
    const response = await api.get<Transport[]>(`/itineraries/${itineraryId}/transports`);
    return response.data;
  },

  getById: async (id: string): Promise<Transport> => {
    const response = await api.get<Transport>(`/transports/${id}`);
    return response.data;
  },

  create: async (data: CreateTransportDTO): Promise<Transport> => {
    const response = await api.post<Transport>('/transports', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTransportDTO): Promise<Transport> => {
    const response = await api.put<Transport>(`/transports/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transports/${id}`);
  },
};

export default api;
