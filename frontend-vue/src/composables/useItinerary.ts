import { ref, computed } from 'vue'
import { itinerariesApi } from '@/api/itineraries'
import type { Itinerary, ItineraryFormData, ApiError } from '@/types'

export function useItinerary() {
  const itineraries = ref<Itinerary[]>([])
  const currentItinerary = ref<Itinerary | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const hasItineraries = computed(() => itineraries.value.length > 0)
  const sortedItineraries = computed(() => {
    return [...itineraries.value].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  })

  // Fetch all itineraries
  const fetchItineraries = async () => {
    isLoading.value = true
    error.value = null
    try {
      itineraries.value = await itinerariesApi.getAll()
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to fetch itineraries:', apiError)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch single itinerary
  const fetchItinerary = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      currentItinerary.value = await itinerariesApi.getById(id)
      return currentItinerary.value
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to fetch itinerary:', apiError)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Create new itinerary
  const createItinerary = async (data: ItineraryFormData) => {
    isLoading.value = true
    error.value = null
    try {
      const newItinerary = await itinerariesApi.create(data)
      itineraries.value.push(newItinerary)
      return newItinerary
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to create itinerary:', apiError)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update itinerary
  const updateItinerary = async (id: string, data: Partial<ItineraryFormData>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedItinerary = await itinerariesApi.update(id, data)
      
      // Update in list
      const index = itineraries.value.findIndex(i => i.id === id)
      if (index !== -1) {
        itineraries.value[index] = updatedItinerary
      }
      
      // Update current if it's the same
      if (currentItinerary.value?.id === id) {
        currentItinerary.value = updatedItinerary
      }
      
      return updatedItinerary
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to update itinerary:', apiError)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete itinerary
  const deleteItinerary = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await itinerariesApi.delete(id)
      itineraries.value = itineraries.value.filter(i => i.id !== id)
      if (currentItinerary.value?.id === id) {
        currentItinerary.value = null
      }
      return true
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to delete itinerary:', apiError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    itineraries,
    currentItinerary,
    isLoading,
    error,
    
    // Computed
    hasItineraries,
    sortedItineraries,
    
    // Methods
    fetchItineraries,
    fetchItinerary,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    clearError,
  }
}
