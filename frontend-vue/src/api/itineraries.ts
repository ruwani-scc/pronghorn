import apiClient from './client'
import type { Itinerary, ItineraryFormData, ApiResponse } from '@/types'

export const itinerariesApi = {
  // Get all itineraries for the current user
  async getAll(): Promise<Itinerary[]> {
    const response = await apiClient.get<ApiResponse<Itinerary[]>>('/itineraries')
    return response.data.data
  },

  // Get a single itinerary by ID
  async getById(id: string): Promise<Itinerary> {
    const response = await apiClient.get<ApiResponse<Itinerary>>(`/itineraries/${id}`)
    return response.data.data
  },

  // Create a new itinerary
  async create(data: ItineraryFormData): Promise<Itinerary> {
    const response = await apiClient.post<ApiResponse<Itinerary>>('/itineraries', data)
    return response.data.data
  },

  // Update an existing itinerary
  async update(id: string, data: Partial<ItineraryFormData>): Promise<Itinerary> {
    const response = await apiClient.put<ApiResponse<Itinerary>>(`/itineraries/${id}`, data)
    return response.data.data
  },

  // Delete an itinerary
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/itineraries/${id}`)
  },
}
