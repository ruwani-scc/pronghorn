import { ref, computed } from 'vue'
import { itemsApi } from '@/api/items'
import type { ItineraryItem, ItineraryItemFormData, ItemCategory, ApiError } from '@/types'

export function useItineraryItems(itineraryId: string) {
  const items = ref<ItineraryItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties - categorized items
  const accommodations = computed(() => 
    items.value.filter(item => item.category === 'accommodation')
      .sort((a, b) => a.displayOrder - b.displayOrder)
  )

  const activities = computed(() => 
    items.value.filter(item => item.category === 'activity')
      .sort((a, b) => a.displayOrder - b.displayOrder)
  )

  const transport = computed(() => 
    items.value.filter(item => item.category === 'transport')
      .sort((a, b) => a.displayOrder - b.displayOrder)
  )

  const itemsByCategory = computed(() => (category: ItemCategory) => {
    return items.value
      .filter(item => item.category === category)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  })

  const totalItems = computed(() => items.value.length)
  const completedItems = computed(() => items.value.filter(item => item.isCompleted).length)
  const completionPercentage = computed(() => {
    if (totalItems.value === 0) return 0
    return Math.round((completedItems.value / totalItems.value) * 100)
  })

  // Fetch all items for the itinerary
  const fetchItems = async () => {
    isLoading.value = true
    error.value = null
    try {
      items.value = await itemsApi.getByItinerary(itineraryId)
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to fetch items:', apiError)
    } finally {
      isLoading.value = false
    }
  }

  // Add new item
  const addItem = async (data: ItineraryItemFormData) => {
    isLoading.value = true
    error.value = null
    try {
      const newItem = await itemsApi.create(itineraryId, data)
      items.value.push(newItem)
      return newItem
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to add item:', apiError)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update item
  const updateItem = async (itemId: string, data: Partial<ItineraryItemFormData>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedItem = await itemsApi.update(itemId, data)
      const index = items.value.findIndex(i => i.id === itemId)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      return updatedItem
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to update item:', apiError)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete item
  const deleteItem = async (itemId: string) => {
    isLoading.value = true
    error.value = null
    try {
      await itemsApi.delete(itemId)
      items.value = items.value.filter(i => i.id !== itemId)
      return true
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to delete item:', apiError)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Toggle completion status
  const toggleComplete = async (itemId: string) => {
    const item = items.value.find(i => i.id === itemId)
    if (!item) return false

    const newStatus = !item.isCompleted
    try {
      const updatedItem = await itemsApi.toggleComplete(itemId, newStatus)
      const index = items.value.findIndex(i => i.id === itemId)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      return true
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to toggle item completion:', apiError)
      return false
    }
  }

  // Reorder items
  const reorderItems = async (reorderedItems: ItineraryItem[]) => {
    const updates = reorderedItems.map((item, index) => ({
      id: item.id,
      displayOrder: index
    }))

    try {
      await itemsApi.reorder(updates)
      // Update local state
      reorderedItems.forEach((item, index) => {
        const localItem = items.value.find(i => i.id === item.id)
        if (localItem) {
          localItem.displayOrder = index
        }
      })
      return true
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.message
      console.error('Failed to reorder items:', apiError)
      return false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    items,
    isLoading,
    error,
    
    // Computed
    accommodations,
    activities,
    transport,
    itemsByCategory,
    totalItems,
    completedItems,
    completionPercentage,
    
    // Methods
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    toggleComplete,
    reorderItems,
    clearError,
  }
}
