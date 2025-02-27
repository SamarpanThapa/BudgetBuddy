<template>
  <div class="space-y-8">
    <!-- Event List -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Event Budgets</h2>
        <button
          @click="showAddEvent = true"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Add Event
        </button>
      </div>

      <!-- Event Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="event in sortedEvents"
          :key="event.id"
          class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 relative"
        >
          <div class="absolute top-2 right-2">
            <button
              @click="deleteEvent(event.id)"
              class="text-gray-400 hover:text-red-600"
            >
              ×
            </button>
          </div>

          <h3 class="text-xl font-semibold mb-2">{{ event.name }}</h3>
          <div class="space-y-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(event.date) }}
            </p>
            <div class="flex justify-between text-sm">
              <span>Budget:</span>
              <span class="font-medium">{{ formatCurrency(event.budget) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Spent:</span>
              <span class="font-medium">{{ formatCurrency(event.spent) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Remaining:</span>
              <span
                :class="event.budget - event.spent > 0 ? 'text-green-600' : 'text-red-600'"
                class="font-medium"
              >
                {{ formatCurrency(event.budget - event.spent) }}
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full"
                  :class="getBudgetProgressColor(event.spent / event.budget)"
                  :style="{ width: \`\${Math.min((event.spent / event.budget) * 100, 100)}%\` }"
                ></div>
              </div>
              <div class="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
                <span>{{ Math.round((event.spent / event.budget) * 100) }}% spent</span>
                <span>{{ getDaysUntilEvent(event.date) }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2 mt-4">
              <button
                @click="showAddExpense(event)"
                class="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Add Expense
              </button>
              <button
                @click="showEventDetails(event)"
                class="flex-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Event Modal -->
    <div v-if="showAddEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-2xl font-semibold mb-4">Add Event</h2>
        
        <form @submit.prevent="handleAddEvent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Event Name</label>
            <input
              v-model="newEvent.name"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input
              v-model="newEvent.date"
              type="date"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Budget</label>
            <input
              v-model="newEvent.budget"
              type="number"
              step="0.01"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea
              v-model="newEvent.description"
              rows="3"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddEvent = false"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-semibold">{{ selectedEvent.name }}</h2>
          <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <div class="space-y-6">
          <!-- Event Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Date</h3>
              <p class="mt-1">{{ formatDate(selectedEvent.date) }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Budget</h3>
              <p class="mt-1">{{ formatCurrency(selectedEvent.budget) }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Spent</h3>
              <p class="mt-1">{{ formatCurrency(selectedEvent.spent) }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Remaining</h3>
              <p
                class="mt-1"
                :class="selectedEvent.budget - selectedEvent.spent > 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatCurrency(selectedEvent.budget - selectedEvent.spent) }}
              </p>
            </div>
          </div>

          <!-- Expense List -->
          <div>
            <h3 class="text-lg font-medium mb-3">Expenses</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="expense in selectedEvent.expenses" :key="expense.id">
                    <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(expense.date) }}</td>
                    <td class="px-6 py-4">{{ expense.description }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ formatCurrency(expense.amount) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button
                        @click="deleteExpense(selectedEvent.id, expense.id)"
                        class="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Expense Modal -->
    <div v-if="showExpenseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-2xl font-semibold mb-4">Add Expense to {{ selectedEventForExpense?.name }}</h2>
        
        <form @submit.prevent="handleAddExpense" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Amount</label>
            <input
              v-model="newExpense.amount"
              type="number"
              step="0.01"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <input
              v-model="newExpense.description"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input
              v-model="newExpense.date"
              type="date"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showExpenseModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBudgetStore } from '../stores/budget'

const budgetStore = useBudgetStore()

// State
const showAddEvent = ref(false)
const showExpenseModal = ref(false)
const selectedEvent = ref(null)
const selectedEventForExpense = ref(null)

const newEvent = ref({
  name: '',
  date: '',
  budget: '',
  description: ''
})

const newExpense = ref({
  amount: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

// Computed
const sortedEvents = computed(() => {
  return [...budgetStore.eventBudgets].sort((a, b) => new Date(a.date) - new Date(b.date))
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getBudgetProgressColor = (percentage) => {
  if (percentage >= 1) return 'bg-red-600'
  if (percentage >= 0.8) return 'bg-yellow-600'
  return 'bg-green-600'
}

const getDaysUntilEvent = (date) => {
  const today = new Date()
  const eventDate = new Date(date)
  const diffTime = eventDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'Past event'
  if (diffDays === 0) return 'Today'
  return `${diffDays} days left`
}

const handleAddEvent = () => {
  budgetStore.addEventBudget({
    ...newEvent.value,
    budget: parseFloat(newEvent.value.budget),
    spent: 0,
    expenses: []
  })
  showAddEvent.value = false
  newEvent.value = {
    name: '',
    date: '',
    budget: '',
    description: ''
  }
}

const showAddExpense = (event) => {
  selectedEventForExpense.value = event
  showExpenseModal.value = true
}

const handleAddExpense = () => {
  if (!selectedEventForExpense.value) return

  const expense = {
    ...newExpense.value,
    amount: parseFloat(newExpense.value.amount),
    id: Date.now()
  }

  budgetStore.updateEventBudgetSpent(selectedEventForExpense.value.id, expense)
  showExpenseModal.value = false
  newExpense.value = {
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  }
  selectedEventForExpense.value = null
}

const showEventDetails = (event) => {
  selectedEvent.value = event
}

const deleteEvent = (eventId) => {
  if (confirm('Are you sure you want to delete this event?')) {
    budgetStore.deleteEventBudget(eventId)
  }
}

const deleteExpense = (eventId, expenseId) => {
  if (confirm('Are you sure you want to delete this expense?')) {
    budgetStore.deleteEventExpense(eventId, expenseId)
  }
}
</script>

<style scoped>
/* Add your styles here */
</style> 