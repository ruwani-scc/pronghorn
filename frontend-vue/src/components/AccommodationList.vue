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

const { addItem, updateItem, deleteItem, toggleComplete } = useItineraryItems(props.itineraryId)

const showAddForm = ref(false)
const editingItemId = ref<string | null>(null)
const newItem = ref({
  title: '',
  location: '',
  startDatetime: '',
  endDatetime: '',
  confirmationCode: '',
  cost: undefined as number | undefined
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const handleAddItem = async () => {
  if (!newItem.value.title) return
  
  try {
    await addItem({
      category: 'accommodation',
      title: newItem.value.title,
      location: newItem.value.location,
      startDatetime: newItem.value.startDatetime,
      endDatetime: newItem.value.endDatetime,
      confirmationCode: newItem.value.confirmationCode,
      cost: newItem.value.cost
    })
    
    // Reset form
    newItem.value = {
      title: '',
      location: '',
      startDatetime: '',
      endDatetime: '',
      confirmationCode: '',
      cost: undefined
    }
    showAddForm.value = false
    emit('refresh')
  } catch (error) {
    console.error('Failed to add accommodation:', error)
  }
}

const handleToggleComplete = async (itemId: string) => {
  await toggleComplete(itemId)
  emit('refresh')
}

const handleDelete = async (itemId: string) => {
  if (confirm('Are you sure you want to delete this accommodation?')) {
    await deleteItem(itemId)
    emit('refresh')
  }
}
</script>

<template>
  <div class="accommodation-list">
    <div v-if="items.length === 0 && !showAddForm" class="empty-state">
      <p>No accommodations added yet</p>
      <button @click="showAddForm = true" class="btn btn-primary">
        + Add Accommodation
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
          <div v-if="item.location" class="detail">
            <span class="icon">📍</span>
            <span>{{ item.location }}</span>
          </div>
          <div v-if="item.startDatetime && item.endDatetime" class="detail">
            <span class="icon">📅</span>
            <span>{{ formatDate(item.startDatetime) }} - {{ formatDate(item.endDatetime) }}</span>
          </div>
          <div v-if="item.confirmationCode" class="detail">
            <span class="icon">🔖</span>
            <span>Confirmation: {{ item.confirmationCode }}</span>
          </div>
          <div v-if="item.cost" class="detail">
            <span class="icon">💰</span>
            <span>{{ item.currency || 'USD' }} {{ item.cost }}</span>
          </div>
        </div>
      </div>

      <button v-if="!showAddForm" @click="showAddForm = true" class="btn btn-outline add-btn">
        + Add Accommodation
      </button>

      <div v-if="showAddForm" class="add-form">
        <h4>Add New Accommodation</h4>
        <div class="form-group">
          <input v-model="newItem.title" type="text" placeholder="Hotel/Accommodation Name *" class="form-input" />
        </div>
        <div class="form-group">
          <input v-model="newItem.location" type="text" placeholder="Address/Location" class="form-input" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="newItem.startDatetime" type="date" placeholder="Check-in" class="form-input" />
          </div>
          <div class="form-group">
            <input v-model="newItem.endDatetime" type="date" placeholder="Check-out" class="form-input" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="newItem.confirmationCode" type="text" placeholder="Confirmation Code" class="form-input" />
          </div>
          <div class="form-group">
            <input v-model.number="newItem.cost" type="number" placeholder="Cost" class="form-input" />
          </div>
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
.accommodation-list {
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
  border-left: 4px solid #42b983;
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
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1rem;
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
