<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useItinerary } from '@/composables/useItinerary'
import { useItineraryItems } from '@/composables/useItineraryItems'
import AccommodationList from '@/components/AccommodationList.vue'
import ActivityList from '@/components/ActivityList.vue'
import TransportList from '@/components/TransportList.vue'
import ProgressTracker from '@/components/ProgressTracker.vue'

const router = useRouter()
const route = useRoute()
const itineraryId = route.params.id as string

const { currentItinerary, fetchItinerary, deleteItinerary, isLoading, error } = useItinerary()
const items = useItineraryItems(itineraryId)

const showDeleteConfirm = ref(false)

onMounted(async () => {
  await fetchItinerary(itineraryId)
  await items.fetchItems()
})

const handleEdit = () => {
  router.push(`/itinerary/${itineraryId}/edit`)
}

const handleDelete = () => {
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  const success = await deleteItinerary(itineraryId)
  if (success) {
    router.push('/dashboard')
  }
  showDeleteConfirm.value = false
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="itinerary-detail">
    <div class="container">
      <div v-if="isLoading && !currentItinerary" class="loading-container">
        <div class="spinner"></div>
        <p>Loading itinerary...</p>
      </div>

      <div v-else-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-else-if="currentItinerary">
        <!-- Header -->
        <div class="itinerary-header">
          <div class="header-content">
            <h1>{{ currentItinerary.title }}</h1>
            <p class="destination">{{ currentItinerary.destination }}</p>
            <p class="dates">
              {{ formatDate(currentItinerary.startDate) }} - {{ formatDate(currentItinerary.endDate) }}
            </p>
            <p v-if="currentItinerary.description" class="description">
              {{ currentItinerary.description }}
            </p>
          </div>
          <div class="header-actions">
            <button @click="handleEdit" class="btn btn-secondary">
              Edit Itinerary
            </button>
            <button @click="handleDelete" class="btn btn-danger">
              Delete
            </button>
          </div>
        </div>

        <!-- Progress Tracker -->
        <ProgressTracker
          :total-items="items.totalItems.value"
          :completed-items="items.completedItems.value"
          :accommodations="items.accommodations.value.length"
          :activities="items.activities.value.length"
          :transport="items.transport.value.length"
        />

        <!-- Items Sections -->
        <div class="items-sections">
          <section class="items-section">
            <h2>🏨 Accommodations</h2>
            <AccommodationList
              :items="items.accommodations.value"
              :itinerary-id="itineraryId"
              @refresh="items.fetchItems"
            />
          </section>

          <section class="items-section">
            <h2>🎯 Activities</h2>
            <ActivityList
              :items="items.activities.value"
              :itinerary-id="itineraryId"
              @refresh="items.fetchItems"
            />
          </section>

          <section class="items-section">
            <h2>🚗 Transport</h2>
            <TransportList
              :items="items.transport.value"
              :itinerary-id="itineraryId"
              @refresh="items.fetchItems"
            />
          </section>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
        <div class="modal" @click.stop>
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete this itinerary? This action cannot be undone.</p>
          <div class="modal-actions">
            <button @click="cancelDelete" class="btn btn-secondary">Cancel</button>
            <button @click="confirmDelete" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.itinerary-detail {
  padding: 2rem 0;
}

.loading-container {
  text-align: center;
  padding: 3rem 0;
}

.itinerary-header {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-content h1 {
  margin: 0 0 0.5rem 0;
}

.destination {
  font-size: 1.25rem;
  color: #42b983;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.dates {
  color: #6c757d;
  margin: 0 0 1rem 0;
}

.description {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.items-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.items-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.items-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
}

.modal h3 {
  margin-top: 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .itinerary-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .header-actions .btn {
    width: 100%;
  }
}
</style>
