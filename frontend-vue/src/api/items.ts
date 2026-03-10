import apiClient from './client'
import type { ItineraryItem, ItineraryItemFormData, ApiResponse } from '@/types'

export const itemsApi = {
  // Get all items for an itinerary
  async getByItinerary(itineraryId: string): Promise<ItineraryItem[]> {
    const response = await apiClient.get<ApiResponse<ItineraryItem[]>>(
      `/itineraries/${itineraryId}/items`
    )
    return response.data.data
  },

  // Create a new item
  async create(itineraryId: string, data: ItineraryItemFormData): Promise<ItineraryItem> {
    const response = await apiClient.post<ApiResponse<ItineraryItem>>(
      `/itineraries/${itineraryId}/items`,
      data
    )
    return response.data.data
  },

  // Update an existing item
  async update(itemId: string, data: Partial<ItineraryItemFormData>): Promise<ItineraryItem> {
    const response = await apiClient.put<ApiResponse<ItineraryItem>>(`/items/${itemId}`, data)
    return response.data.data
  },

  // Delete an item
  async delete(itemId: string): Promise<void> {
    await apiClient.delete(`/items/${itemId}`)
  },

  // Toggle completion status
  async toggleComplete(itemId: string, isCompleted: boolean): Promise<ItineraryItem> {
    const response = await apiClient.patch<ApiResponse<ItineraryItem>>(
      `/items/${itemId}`,
      { isCompleted }
    )
    return response.data.data
  },

  // Reorder items
  async reorder(items: { id: string; displayOrder: number }[]): Promise<void> {
    await apiClient.post('/items/bulk', { action: 'reorder', items })
  },
}
