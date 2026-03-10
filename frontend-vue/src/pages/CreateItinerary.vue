<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useItinerary } from '@/composables/useItinerary'
import ItineraryForm from '@/components/ItineraryForm.vue'
import type { ItineraryFormData } from '@/types'

const router = useRouter()
const { createItinerary, isLoading, error } = useItinerary()
const successMessage = ref('')

const handleSubmit = async (formData: ItineraryFormData) => {
  try {
    const newItinerary = await createItinerary(formData)
    successMessage.value = 'Itinerary created successfully!'
    
    // Redirect to the new itinerary detail page after a short delay
    setTimeout(() => {
      router.push(`/itinerary/${newItinerary.id}`)
    }, 1000)
  } catch (err) {
    // Error is handled by the composable
  }
}

const handleCancel = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="create-itinerary">
    <div class="container">
      <div class="page-header">
        <h1>Create New Itinerary</h1>
        <p class="subtitle">Plan your next adventure with all the details in one place</p>
      </div>

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div class="form-container">
        <ItineraryForm
          @submit="handleSubmit"
          @cancel="handleCancel"
          :is-loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-itinerary {
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

.form-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
