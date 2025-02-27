<template>
  <div class="space-y-6">
    <!-- Event Budget Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg hover:shadow-xl">
        <div class="p-6">
          <h3 class="text-sm font-medium text-amber-800">Active Events</h3>
          <p class="mt-2 text-3xl font-bold text-amber-900 tracking-tight">
            {{ activeEvents.length }}
          </p>
          <div class="mt-4 space-y-2">
            <div class="flex items-center justify-between text-sm text-amber-600">
              <span>Total Budget</span>
              <span>{{ formatCurrency(totalEventBudget) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm text-amber-600">
              <span>Spent</span>
              <span>{{ formatCurrency(totalEventSpent) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg hover:shadow-xl">
        <div class="p-6">
          <h3 class="text-sm font-medium text-emerald-800">Upcoming Events</h3>
          <p class="mt-2 text-3xl font-bold text-emerald-900 tracking-tight">
            {{ upcomingEvents.length }}
          </p>
          <div class="mt-4">
            <div class="text-sm text-emerald-600">
              Next event: {{ nextEventName }}
            </div>
            <div class="text-sm text-emerald-600">
              Starting in {{ daysUntilNextEvent }} days
            </div>
          </div>
        </div>
      </div>

      <div class="card transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-violet-50 to-violet-100 shadow-lg hover:shadow-xl">
        <div class="p-6">
          <h3 class="text-sm font-medium text-violet-800">Completed Events</h3>
          <p class="mt-2 text-3xl font-bold text-violet-900 tracking-tight">
            {{ completedEvents.length }}
          </p>
          <div class="mt-4">
            <div class="text-sm text-violet-600">
              Last event: {{ lastEventName }}
            </div>
            <div class="text-sm text-violet-600">
              {{ lastEventStatus }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Event Budget -->
    <div class="card shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Event Budget</h3>
            <p class="mt-1 text-sm text-gray-500">Plan and track your event expenses</p>
          </div>
          <button @click="showForm = !showForm" class="btn-primary">
            {{ showForm ? 'Hide Form' : 'Add Event' }}
          </button>
        </div>

        <Transition name="slide">
          <form v-if="showForm" @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Event Name</label>
                <input
                  type="text"
                  v-model="form.name"
                  class="input-field"
                  placeholder="Enter event name"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  v-model="form.startDate"
                  class="input-field"
                  :min="today"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  v-model="form.endDate"
                  class="input-field"
                  :min="form.startDate"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Total Budget</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    v-model="form.budget"
                    min="0"
                    step="0.01"
                    class="input-field pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="form.category" class="input-field">
                  <option value="vacation">Vacation</option>
                  <option value="wedding">Wedding</option>
                  <option value="party">Party</option>
                  <option value="holiday">Holiday</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="input-field"
                  placeholder="Add event details"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="resetForm"
                class="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
              >
                Add Event
              </button>
            </div>
          </form>
        </Transition>
      </div>
    </div>

    <!-- Event List -->
    <div class="card shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">Event List</h3>
          <div class="flex items-center space-x-2">
            <button
              v-for="status in ['all', 'upcoming', 'active', 'completed']"
              :key="status"
              @click="filter = status"
              class="px-3 py-1.5 text-xs font-medium rounded-full"
              :class="filter === status ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:text-gray-700'"
            >
              {{ status.charAt(0).toUpperCase() + status.slice(1) }}
            </button>
          </div>
        </div>

        <TransitionGroup name="list" tag="div" class="space-y-4">
          <div v-for="event in filteredEvents" :key="event.id"
               class="group p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center justify-center h-10 w-10 rounded-full"
                        :class="getEventIconClass(event)">
                    {{ getEventIcon(event.category) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ event.name }}</p>
                  <div class="flex items-center text-sm text-gray-500">
                    <span>{{ event.category }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ formatDateRange(event.startDate, event.endDate) }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(event.spent) }} / {{ formatCurrency(event.budget) }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ (event.spent / event.budget * 100).toFixed(1) }}% spent
                  </p>
                </div>
                <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    @click="addExpense(event)"
                    class="text-gray-400 hover:text-blue-600 transition-colors duration-150"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button
                    @click="editEvent(event)"
                    class="text-gray-400 hover:text-blue-600 transition-colors duration-150"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteEvent(event)"
                    class="text-gray-400 hover:text-red-600 transition-colors duration-150"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-500 ease-out"
                :class="getProgressColor(event.spent / event.budget * 100)"
                :style="{ width: `${Math.min(event.spent / event.budget * 100, 100)}%` }"
              ></div>
            </div>
          </div>
        </TransitionGroup>

        <!-- Empty State -->
        <div v-if="filteredEvents.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating a new event budget.
          </p>
          <div class="mt-6">
            <button
              type="button"
              @click="showForm = true"
              class="btn-primary"
            >
              Add Event
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Expense Modal -->
    <Transition name="modal">
      <div v-if="showExpenseModal" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showExpenseModal = false"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div class="mt-3 text-center sm:mt-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Add Expense to {{ selectedEvent?.name }}
                </h3>
                <div class="mt-4">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Amount</label>
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          v-model="expenseForm.amount"
                          min="0"
                          step="0.01"
                          class="input-field pl-7"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        v-model="expenseForm.description"
                        class="input-field"
                        placeholder="Enter expense description"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        v-model="expenseForm.date"
                        class="input-field"
                        :min="selectedEvent?.startDate"
                        :max="selectedEvent?.endDate"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                class="btn-primary sm:col-start-2"
                @click="handleExpenseSubmit"
              >
                Add Expense
              </button>
              <button
                type="button"
                class="btn-secondary sm:col-start-1"
                @click="showExpenseModal = false"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBudgetStore } from '../stores/budget'

const store = useBudgetStore()
const showForm = ref(false)
const filter = ref('all')
const showExpenseModal = ref(false)
const selectedEvent = ref(null)

const today = new Date().toISOString().split('T')[0]

const form = ref({
  name: '',
  startDate: today,
  endDate: '',
  budget: '',
  category: 'other',
  description: ''
})

const expenseForm = ref({
  amount: '',
  description: '',
  date: today
})

const activeEvents = computed(() => 
  store.events.filter(e => {
    const now = new Date()
    const start = new Date(e.startDate)
    const end = new Date(e.endDate)
    return start <= now && end >= now
  })
)

const upcomingEvents = computed(() => 
  store.events.filter(e => new Date(e.startDate) > new Date())
)

const completedEvents = computed(() => 
  store.events.filter(e => new Date(e.endDate) < new Date())
)

const totalEventBudget = computed(() => 
  activeEvents.value.reduce((sum, e) => sum + e.budget, 0)
)

const totalEventSpent = computed(() => 
  activeEvents.value.reduce((sum, e) => sum + e.spent, 0)
)

const nextEventName = computed(() => {
  const next = upcomingEvents.value[0]
  return next ? next.name : 'No upcoming events'
})

const daysUntilNextEvent = computed(() => {
  const next = upcomingEvents.value[0]
  if (!next) return 0
  const diff = new Date(next.startDate) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const lastEventName = computed(() => {
  const last = completedEvents.value[completedEvents.value.length - 1]
  return last ? last.name : 'No completed events'
})

const lastEventStatus = computed(() => {
  const last = completedEvents.value[completedEvents.value.length - 1]
  if (!last) return ''
  const percentage = (last.spent / last.budget) * 100
  return percentage <= 100 ? 'Under budget' : 'Over budget'
})

const filteredEvents = computed(() => {
  let events = [...store.events]
  const now = new Date()

  switch (filter.value) {
    case 'upcoming':
      events = events.filter(e => new Date(e.startDate) > now)
      break
    case 'active':
      events = events.filter(e => {
        const start = new Date(e.startDate)
        const end = new Date(e.endDate)
        return start <= now && end >= now
      })
      break
    case 'completed':
      events = events.filter(e => new Date(e.endDate) < now)
      break
  }

  return events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
})

const handleSubmit = () => {
  if (!form.value.name || !form.value.budget) return

  store.addEvent({
    ...form.value,
    budget: parseFloat(form.value.budget),
    spent: 0,
    expenses: []
  })

  resetForm()
}

const resetForm = () => {
  form.value = {
    name: '',
    startDate: today,
    endDate: '',
    budget: '',
    category: 'other',
    description: ''
  }
  showForm.value = false
}

const handleExpenseSubmit = () => {
  if (!expenseForm.value.amount || !selectedEvent.value) return

  store.addEventExpense(selectedEvent.value.id, {
    ...expenseForm.value,
    amount: parseFloat(expenseForm.value.amount)
  })

  showExpenseModal.value = false
  expenseForm.value = {
    amount: '',
    description: '',
    date: today
  }
}

const addExpense = (event) => {
  selectedEvent.value = event
  expenseForm.value.date = today
  showExpenseModal.value = true
}

const editEvent = (event) => {
  form.value = { ...event }
  showForm.value = true
}

const deleteEvent = (event) => {
  if (confirm('Are you sure you want to delete this event?')) {
    store.deleteEvent(event.id)
  }
}

const getEventIcon = (category) => {
  switch (category) {
    case 'vacation': return '✈️'
    case 'wedding': return '💒'
    case 'party': return '🎉'
    case 'holiday': return '🎄'
    default: return '📅'
  }
}

const getEventIconClass = (event) => {
  const now = new Date()
  const start = new Date(event.startDate)
  const end = new Date(event.endDate)

  if (end < now) return 'bg-gray-100 text-gray-700'
  if (start > now) return 'bg-blue-100 text-blue-700'
  return 'bg-green-100 text-green-700'
}

const getProgressColor = (percentage) => {
  if (percentage >= 100) return 'bg-red-600'
  if (percentage >= 90) return 'bg-orange-500'
  if (percentage >= 75) return 'bg-yellow-500'
  return 'bg-green-600'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDateRange = (start, end) => {
  const startDate = new Date(start).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  const endDate = new Date(end).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  return `${startDate} - ${endDate}`
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.card {
  @apply rounded-xl border border-gray-200 bg-white overflow-hidden;
}

.input-field {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}

.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
</style> 