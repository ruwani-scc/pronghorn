<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useItinerary } from '@/composables/useItinerary'
import ItineraryForm from '@/components/ItineraryForm.vue'
import type { ItineraryFormData } from '@/types'

const router = useRouter()
const route = useRoute()
const { currentItinerary, fetchItinerary, updateItinerary, isLoading, error } = useItinerary()
const successMessage = ref('')

const itineraryId = route.params.id as string

onMounted(async () => {
  await fetchItinerary(itineraryId)
})

const handleSubmit = async (formData: ItineraryFormData) => {
  try {
    await updateItinerary(itineraryId, formData)
    successMessage.value = 'Itinerary updated successfully!'
    
    // Redirect back to detail page after a short delay
    setTimeout(() => {
      router.push(`/itinerary/${itineraryId}`)
    }, 1000)
  } catch (err) {
    // Error is handled by the composable
  }
}

const handleCancel = () => {
  router.push(`/itinerary/${itineraryId}`)
}
</script>

<template>
  <div class="edit-itinerary">
    <div class="container">
      <div class="page-header">
        <h1>Edit Itinerary</h1>
        <p class="subtitle">Update your trip details</p>
      </div>

      <div v-if="isLoading && !currentItinerary" class="loading-container">
        <div class="spinner"></div>
        <p>Loading itinerary...</p>
      </div>

      <div v-else-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-else-if="currentItinerary" class="form-container">
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <ItineraryForm
          :initial-data="currentItinerary"
          @submit="handleSubmit"
          @cancel="handleCancel"
          :is-loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-itinerary {
  padding: 2rem 0;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6c757d;
  font-size: 1.125rem;
}

.loading-container {
  text-align: center;
  padding: 3rem 0;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
