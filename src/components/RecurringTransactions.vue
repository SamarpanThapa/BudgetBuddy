<template>
  <div class="space-y-6">
    <!-- Recurring Transactions Summary -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg hover:shadow-xl">
        <div class="p-6">
          <h3 class="text-sm font-medium text-indigo-800">Recurring Income</h3>
          <p class="mt-2 text-3xl font-bold text-indigo-900 tracking-tight">
            {{ formatCurrency(totalRecurringIncome) }}
          </p>
          <div class="mt-4 space-y-2">
            <div v-for="income in recurringIncome" :key="income.id" 
                 class="flex items-center justify-between text-sm text-indigo-600">
              <span>{{ income.description }}</span>
              <span>{{ formatCurrency(income.amount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-rose-50 to-rose-100 shadow-lg hover:shadow-xl">
        <div class="p-6">
          <h3 class="text-sm font-medium text-rose-800">Recurring Expenses</h3>
          <p class="mt-2 text-3xl font-bold text-rose-900 tracking-tight">
            {{ formatCurrency(totalRecurringExpenses) }}
          </p>
          <div class="mt-4 space-y-2">
            <div v-for="expense in recurringExpenses" :key="expense.id"
                 class="flex items-center justify-between text-sm text-rose-600">
              <span>{{ expense.description }}</span>
              <span>{{ formatCurrency(expense.amount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Recurring Transaction -->
    <div class="card shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Recurring Transactions</h3>
            <p class="mt-1 text-sm text-gray-500">Set up your regular income and expenses</p>
          </div>
          <button @click="showForm = !showForm" class="btn-primary">
            {{ showForm ? 'Hide Form' : 'Add Recurring' }}
          </button>
        </div>

        <Transition name="slide">
          <form v-if="showForm" @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Type</label>
                <select v-model="form.type" class="input-field">
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Amount</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    v-model="form.amount"
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
                  <option v-for="category in allCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Frequency</label>
                <select v-model="form.frequency" class="input-field">
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  v-model="form.description"
                  class="input-field"
                  placeholder="Enter description"
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
                <label class="block text-sm font-medium text-gray-700">End Date (Optional)</label>
                <input
                  type="date"
                  v-model="form.endDate"
                  class="input-field"
                  :min="form.startDate"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  class="input-field"
                  placeholder="Add any additional notes"
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
                Add Recurring Transaction
              </button>
            </div>
          </form>
        </Transition>
      </div>
    </div>

    <!-- Recurring Transactions List -->
    <div class="card shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">Upcoming Transactions</h3>
          <div class="flex items-center space-x-2">
            <button
              v-for="type in ['all', 'income', 'expense']"
              :key="type"
              @click="filter = type"
              class="px-3 py-1.5 text-xs font-medium rounded-full"
              :class="filter === type ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:text-gray-700'"
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </button>
          </div>
        </div>

        <TransitionGroup name="list" tag="div" class="space-y-4">
          <div v-for="transaction in filteredTransactions" :key="transaction.id"
               class="group p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <span :class="[
                    transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                    'inline-flex items-center justify-center h-10 w-10 rounded-full'
                  ]">
                    {{ transaction.type === 'income' ? '↑' : '↓' }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ transaction.description }}</p>
                  <div class="flex items-center text-sm text-gray-500">
                    <span>{{ transaction.category }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ transaction.frequency }}</span>
                    <span class="mx-2">•</span>
                    <span>Next: {{ formatDate(transaction.nextDue) }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <span :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
                      class="text-sm font-medium">
                  {{ formatCurrency(transaction.amount) }}
                </span>
                <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    @click="editTransaction(transaction)"
                    class="text-gray-400 hover:text-blue-600 transition-colors duration-150"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="toggleActive(transaction)"
                    class="text-gray-400 hover:text-yellow-600 transition-colors duration-150"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteTransaction(transaction)"
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
          </div>
        </TransitionGroup>

        <!-- Empty State -->
        <div v-if="filteredTransactions.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No recurring transactions</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by adding a recurring transaction.
          </p>
          <div class="mt-6">
            <button
              type="button"
              @click="showForm = true"
              class="btn-primary"
            >
              Add Recurring Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBudgetStore } from '../stores/budget'

const store = useBudgetStore()
const showForm = ref(false)
const filter = ref('all')

const today = new Date().toISOString().split('T')[0]

const form = ref({
  type: 'expense',
  amount: '',
  category: '',
  frequency: 'monthly',
  description: '',
  startDate: today,
  endDate: '',
  notes: '',
  isActive: true
})

const allCategories = computed(() => [...store.categories, ...store.customCategories])

const recurringIncome = computed(() => 
  store.recurringTransactions.filter(t => t.type === 'income' && t.isActive)
)

const recurringExpenses = computed(() => 
  store.recurringTransactions.filter(t => t.type === 'expense' && t.isActive)
)

const totalRecurringIncome = computed(() => 
  recurringIncome.value.reduce((sum, t) => sum + t.amount, 0)
)

const totalRecurringExpenses = computed(() => 
  recurringExpenses.value.reduce((sum, t) => sum + t.amount, 0)
)

const filteredTransactions = computed(() => {
  let transactions = [...store.recurringTransactions]
  if (filter.value !== 'all') {
    transactions = transactions.filter(t => t.type === filter.value)
  }
  return transactions.sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue))
})

const handleSubmit = () => {
  if (!form.value.amount || !form.value.description) return

  store.addRecurringTransaction({
    ...form.value,
    amount: parseFloat(form.value.amount)
  })

  resetForm()
}

const resetForm = () => {
  form.value = {
    type: 'expense',
    amount: '',
    category: store.categories[0],
    frequency: 'monthly',
    description: '',
    startDate: today,
    endDate: '',
    notes: '',
    isActive: true
  }
  showForm.value = false
}

const editTransaction = (transaction) => {
  form.value = { ...transaction }
  showForm.value = true
}

const toggleActive = (transaction) => {
  store.updateRecurringTransaction({
    ...transaction,
    isActive: !transaction.isActive
  })
}

const deleteTransaction = (transaction) => {
  if (confirm('Are you sure you want to delete this recurring transaction?')) {
    store.deleteRecurringTransaction(transaction.id)
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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