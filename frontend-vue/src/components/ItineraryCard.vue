<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Itinerary } from '@/types'

interface Props {
  itinerary: Itinerary
}

const props = defineProps<Props>()
const router = useRouter()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const tripDuration = computed(() => {
  const start = new Date(props.itinerary.startDate)
  const end = new Date(props.itinerary.endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  return `${days} ${days === 1 ? 'day' : 'days'}`
})

const handleClick = () => {
  router.push(`/itinerary/${props.itinerary.id}`)
}

const handleEdit = (e: Event) => {
  e.stopPropagation()
  router.push(`/itinerary/${props.itinerary.id}/edit`)
}
</script>

<template>
  <div class="itinerary-card" @click="handleClick">
    <div class="card-header">
      <h3 class="title">{{ itinerary.title }}</h3>
      <span class="badge badge-primary">{{ tripDuration }}</span>
    </div>
    
    <div class="card-body">
      <div class="destination">
        <span class="icon">📍</span>
        <span>{{ itinerary.destination }}</span>
      </div>
      
      <div class="dates">
        <span class="icon">📅</span>
        <span>{{ formatDate(itinerary.startDate) }} - {{ formatDate(itinerary.endDate) }}</span>
      </div>

      <p v-if="itinerary.description" class="description">
        {{ itinerary.description }}
      </p>

      <div v-if="itinerary.itemCounts" class="item-counts">
        <div class="count-item">
          <span class="count-icon">🏨</span>
          <span>{{ itinerary.itemCounts.accommodation }}</span>
        </div>
        <div class="count-item">
          <span class="count-icon">🎯</span>
          <span>{{ itinerary.itemCounts.activity }}</span>
        </div>
        <div class="count-item">
          <span class="count-icon">🚗</span>
          <span>{{ itinerary.itemCounts.transport }}</span>
        </div>
      </div>

      <div v-if="itinerary.completionPercentage !== undefined" class="progress-bar">
        <div class="progress-fill" :style="{ width: `${itinerary.completionPercentage}%` }"></div>
        <span class="progress-text">{{ itinerary.completionPercentage }}% Complete</span>
      </div>
    </div>

    <div class="card-footer">
      <button @click="handleEdit" class="btn btn-sm btn-outline">
        Edit
      </button>
      <button @click="handleClick" class="btn btn-sm btn-primary">
        View Details
      </button>
    </div>
  </div>
</template>

<style scoped>
.itinerary-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.itinerary-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
  flex: 1;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
}

.destination,
.dates {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #6c757d;
}

.icon {
  font-size: 1rem;
}

.description {
  color: #6c757d;
  font-size: 0.875rem;
  margin: 1rem 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-counts {
  display: flex;
  gap: 1.5rem;
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.count-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.count-icon {
  font-size: 1.25rem;
}

.progress-bar {
  position: relative;
  height: 24px;
  background: #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #42b983, #359268);
  transition: width 0.3s ease;
}

.progress-text {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2c3e50;
  z-index: 1;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
