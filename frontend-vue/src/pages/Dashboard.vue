<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useItinerary } from '@/composables/useItinerary'
import ItineraryCard from '@/components/ItineraryCard.vue'

const { itineraries, isLoading, error, fetchItineraries, sortedItineraries } = useItinerary()
const searchQuery = ref('')

onMounted(() => {
  fetchItineraries()
})

const filteredItineraries = ref()
const filterItineraries = () => {
  if (!searchQuery.value) {
    return sortedItineraries.value
  }
  return sortedItineraries.value.filter(itinerary => 
    itinerary.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    itinerary.destination.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}
</script>

<template>
  <div class="dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>My Itineraries</h1>
        <router-link to="/itinerary/new" class="btn btn-primary">
          + Create New Itinerary
        </router-link>
      </div>

      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          class="form-input"
          placeholder="Search itineraries by title or destination..."
        />
      </div>

      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading your itineraries...</p>
      </div>

      <div v-else-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-else-if="filterItineraries().length === 0" class="empty-state">
        <div class="empty-state-content">
          <h2>No Itineraries Yet</h2>
          <p>Start planning your next adventure by creating your first itinerary!</p>
          <router-link to="/itinerary/new" class="btn btn-primary btn-lg">
            Create Your First Itinerary
          </router-link>
        </div>
      </div>

      <div v-else class="itinerary-grid">
        <ItineraryCard
          v-for="itinerary in filterItineraries()"
          :key="itinerary.id"
          :itinerary="itinerary"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0;
}

.search-bar {
  margin-bottom: 2rem;
}

.loading-container {
  text-align: center;
  padding: 3rem 0;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-state-content {
  max-width: 500px;
  margin: 0 auto;
}

.empty-state h2 {
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 2rem;
}

.itinerary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .itinerary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
