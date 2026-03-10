<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Itinerary, ItineraryFormData } from '@/types'

interface Props {
  initialData?: Partial<Itinerary>
  isLoading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [data: ItineraryFormData]
  cancel: []
}>()

const formData = ref<ItineraryFormData>({
  title: props.initialData?.title || '',
  destination: props.initialData?.destination || '',
  startDate: props.initialData?.startDate || '',
  endDate: props.initialData?.endDate || '',
  description: props.initialData?.description || ''
})

const errors = ref<Record<string, string>>({})

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required'
  }

  if (!formData.value.destination.trim()) {
    errors.value.destination = 'Destination is required'
  }

  if (!formData.value.startDate) {
    errors.value.startDate = 'Start date is required'
  }

  if (!formData.value.endDate) {
    errors.value.endDate = 'End date is required'
  }

  if (formData.value.startDate && formData.value.endDate) {
    if (new Date(formData.value.endDate) < new Date(formData.value.startDate)) {
      errors.value.endDate = 'End date must be after start date'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', formData.value)
  }
}

const handleCancel = () => {
  emit('cancel')
}

const isFormValid = computed(() => {
  return formData.value.title.trim() && 
         formData.value.destination.trim() && 
         formData.value.startDate && 
         formData.value.endDate
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="itinerary-form">
    <div class="form-group">
      <label for="title" class="form-label">Trip Title *</label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="form-input"
        :class="{ 'error': errors.title }"
        placeholder="e.g., Summer Vacation in Europe"
        maxlength="255"
      />
      <div v-if="errors.title" class="form-error">{{ errors.title }}</div>
    </div>

    <div class="form-group">
      <label for="destination" class="form-label">Destination *</label>
      <input
        id="destination"
        v-model="formData.destination"
        type="text"
        class="form-input"
        :class="{ 'error': errors.destination }"
        placeholder="e.g., Paris, France"
        maxlength="255"
      />
      <div v-if="errors.destination" class="form-error">{{ errors.destination }}</div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="startDate" class="form-label">Start Date *</label>
        <input
          id="startDate"
          v-model="formData.startDate"
          type="date"
          class="form-input"
          :class="{ 'error': errors.startDate }"
        />
        <div v-if="errors.startDate" class="form-error">{{ errors.startDate }}</div>
      </div>

      <div class="form-group">
        <label for="endDate" class="form-label">End Date *</label>
        <input
          id="endDate"
          v-model="formData.endDate"
          type="date"
          class="form-input"
          :class="{ 'error': errors.endDate }"
        />
        <div v-if="errors.endDate" class="form-error">{{ errors.endDate }}</div>
      </div>
    </div>

    <div class="form-group">
      <label for="description" class="form-label">Description (Optional)</label>
      <textarea
        id="description"
        v-model="formData.description"
        class="form-textarea"
        placeholder="Add any additional details about your trip..."
        rows="4"
      ></textarea>
      <div class="form-hint">Provide a brief overview of your trip</div>
    </div>

    <div class="form-actions">
      <button
        type="button"
        @click="handleCancel"
        class="btn btn-secondary"
        :disabled="isLoading"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="!isFormValid || isLoading"
      >
        {{ isLoading ? 'Saving...' : (initialData ? 'Update Itinerary' : 'Create Itinerary') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.itinerary-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-input.error,
.form-textarea.error {
  border-color: #dc3545;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
