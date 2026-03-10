<script setup lang="ts">
import { ref } from 'vue'
import { useItineraryItems } from '@/composables/useItineraryItems'
import type { ItineraryItem } from '@/types'

interface Props {
  items: ItineraryItem[]
  itineraryId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  refresh: []
}>()

const { addItem, deleteItem, toggleComplete } = useItineraryItems(props.itineraryId)

const showAddForm = ref(false)
const newItem = ref({
  title: '',
  location: '',
  startDatetime: '',
  description: '',
  cost: undefined as number | undefined
})

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const handleAddItem = async () => {
  if (!newItem.value.title) return
  
  try {
    await addItem({
      category: 'activity',
      title: newItem.value.title,
      location: newItem.value.location,
      startDatetime: newItem.value.startDatetime,
      description: newItem.value.description,
      cost: newItem.value.cost
    })
    
    newItem.value = {
      title: '',
      location: '',
      startDatetime: '',
      description: '',
      cost: undefined
    }
    showAddForm.value = false
    emit('refresh')
  } catch (error) {
    console.error('Failed to add activity:', error)
  }
}

const handleToggleComplete = async (itemId: string) => {
  await toggleComplete(itemId)
  emit('refresh')
}

const handleDelete = async (itemId: string) => {
  if (confirm('Are you sure you want to delete this activity?')) {
    await deleteItem(itemId)
    emit('refresh')
  }
}
</script>

<template>
  <div class="activity-list">
    <div v-if="items.length === 0 && !showAddForm" class="empty-state">
      <p>No activities added yet</p>
      <button @click="showAddForm = true" class="btn btn-primary">
        + Add Activity
      </button>
    </div>

    <div v-else>
      <div v-for="item in items" :key="item.id" class="item-card">
        <div class="item-header">
          <div class="item-title-section">
            <input
              type="checkbox"
              :checked="item.isCompleted"
              @change="handleToggleComplete(item.id)"
              class="checkbox"
            />
            <h4 :class="{ 'completed': item.isCompleted }">{{ item.title }}</h4>
          </div>
          <button @click="handleDelete(item.id)" class="btn-icon" title="Delete">
            🗑️
          </button>
        </div>
        
        <div class="item-details">
          <div v-if="item.startDatetime" class="detail">
            <span class="icon">🕐</span>
            <span>{{ formatDateTime(item.startDatetime) }}</span>
          </div>
          <div v-if="item.location" class="detail">
            <span class="icon">📍</span>
            <span>{{ item.location }}</span>
          </div>
          <div v-if="item.description" class="detail description">
            <span class="icon">📝</span>
            <span>{{ item.description }}</span>
          </div>
          <div v-if="item.cost" class="detail">
            <span class="icon">💰</span>
            <span>{{ item.currency || 'USD' }} {{ item.cost }}</span>
          </div>
        </div>
      </div>

      <button v-if="!showAddForm" @click="showAddForm = true" class="btn btn-outline add-btn">
        + Add Activity
      </button>

      <div v-if="showAddForm" class="add-form">
        <h4>Add New Activity</h4>
        <div class="form-group">
          <input v-model="newItem.title" type="text" placeholder="Activity Name *" class="form-input" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="newItem.location" type="text" placeholder="Location" class="form-input" />
          </div>
          <div class="form-group">
            <input v-model="newItem.startDatetime" type="datetime-local" placeholder="Date & Time" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <textarea v-model="newItem.description" placeholder="Description" class="form-textarea" rows="3"></textarea>
        </div>
        <div class="form-group">
          <input v-model.number="newItem.cost" type="number" placeholder="Cost" class="form-input" />
        </div>
        <div class="form-actions">
          <button @click="showAddForm = false" class="btn btn-secondary">Cancel</button>
          <button @click="handleAddItem" class="btn btn-primary" :disabled="!newItem.title">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.item-card {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
  border-left: 4px solid #ffc107;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.item-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.item-title-section h4 {
  margin: 0;
  font-size: 1.125rem;
}

.item-title-section h4.completed {
  text-decoration: line-through;
  color: #6c757d;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.2s;
}

.btn-icon:hover {
  transform: scale(1.2);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.detail {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.detail.description {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #dee2e6;
}

.icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.add-btn {
  margin-top: 1rem;
  width: 100%;
}

.add-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.add-form h4 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
