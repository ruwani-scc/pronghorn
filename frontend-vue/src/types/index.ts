// Type definitions for VacationPlan application

export interface User {
  id: string
  email: string
  authProviderId: string
  createdAt: string
  updatedAt: string
}

export interface Itinerary {
  id: string
  userId: string
  title: string
  destination: string
  startDate: string
  endDate: string
  description?: string
  createdAt: string
  updatedAt: string
  completionPercentage?: number
  itemCounts?: {
    accommodation: number
    activity: number
    transport: number
  }
}

export type ItemCategory = 'accommodation' | 'activity' | 'transport'

export interface ItineraryItem {
  id: string
  itineraryId: string
  category: ItemCategory
  title: string
  description?: string
  startDatetime?: string
  endDatetime?: string
  location?: string
  confirmationCode?: string
  cost?: number
  currency?: string
  metadata?: Record<string, any>
  displayOrder: number
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

// Form data types
export interface ItineraryFormData {
  title: string
  destination: string
  startDate: string
  endDate: string
  description?: string
}

export interface ItineraryItemFormData {
  category: ItemCategory
  title: string
  description?: string
  startDatetime?: string
  endDatetime?: string
  location?: string
  confirmationCode?: string
  cost?: number
  currency?: string
  metadata?: Record<string, any>
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

// Completeness tracking
export interface CompletenessMetrics {
  overall: number
  accommodation: number
  activity: number
  transport: number
  missingItems: string[]
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean
  error: string | null
}
