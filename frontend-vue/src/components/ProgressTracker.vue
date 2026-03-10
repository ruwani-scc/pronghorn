<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  totalItems: number
  completedItems: number
  accommodations: number
  activities: number
  transport: number
}

const props = defineProps<Props>()

const completionPercentage = computed(() => {
  if (props.totalItems === 0) return 0
  return Math.round((props.completedItems / props.totalItems) * 100)
})

const getProgressColor = computed(() => {
  const percentage = completionPercentage.value
  if (percentage < 30) return '#dc3545'
  if (percentage < 70) return '#ffc107'
  return '#42b983'
})

const progressMessage = computed(() => {
  const percentage = completionPercentage.value
  if (percentage === 0) return 'Just getting started'
  if (percentage < 30) return 'Good start!'
  if (percentage < 70) return 'Making progress!'
  if (percentage < 100) return 'Almost there!'
  return 'All set!'
})
</script>

<template>
  <div class="progress-tracker">
    <div class="tracker-header">
      <h3>Trip Planning Progress</h3>
      <span class="progress-message">{{ progressMessage }}</span>
    </div>

    <div class="overall-progress">
      <div class="progress-bar-container">
        <div 
          class="progress-bar-fill" 
          :style="{ 
            width: `${completionPercentage}%`,
            backgroundColor: getProgressColor
          }"
        >
          <span class="progress-text">{{ completionPercentage }}%</span>
        </div>
      </div>
      <div class="progress-stats">
        <span>{{ completedItems }} of {{ totalItems }} items completed</span>
      </div>
    </div>

    <div class="category-breakdown">
      <div class="category-item">
        <div class="category-icon">🏨</div>
        <div class="category-info">
          <span class="category-label">Accommodations</span>
          <span class="category-count">{{ accommodations }} items</span>
        </div>
      </div>

      <div class="category-item">
        <div class="category-icon">🎯</div>
        <div class="category-info">
          <span class="category-label">Activities</span>
          <span class="category-count">{{ activities }} items</span>
        </div>
      </div>

      <div class="category-item">
        <div class="category-icon">🚗</div>
        <div class="category-info">
          <span class="category-label">Transport</span>
          <span class="category-count">{{ transport }} items</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-tracker {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tracker-header h3 {
  margin: 0;
}

.progress-message {
  color: #42b983;
  font-weight: 600;
  font-size: 1.125rem;
}

.overall-progress {
  margin-bottom: 2rem;
}

.progress-bar-container {
  position: relative;
  height: 40px;
  background: #e9ecef;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.5s ease, background-color 0.3s ease;
  border-radius: 20px;
}

.progress-text {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.progress-stats {
  text-align: center;
  color: #6c757d;
  font-size: 0.875rem;
}

.category-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.category-item:hover {
  transform: translateY(-2px);
}

.category-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.category-info {
  display: flex;
  flex-direction: column;
}

.category-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.875rem;
}

.category-count {
  color: #6c757d;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .tracker-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .category-breakdown {
    grid-template-columns: 1fr;
  }
}
</style>
