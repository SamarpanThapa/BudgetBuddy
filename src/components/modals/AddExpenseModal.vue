<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Add Expense</h2>
          <button 
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input
                v-model="amount"
                type="number"
                step="0.01"
                required
                class="block w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              v-model="description"
              type="text"
              required
              class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              placeholder="Enter expense description"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              v-model="categoryId"
              required
              class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
            >
              <option value="" disabled>Select a category</option>
              <option 
                v-for="category in expenseStore.allCategories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.icon }} {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              v-model="date"
              type="date"
              required
              class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="isRecurring"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Make this a recurring expense
            </label>
          </div>

          <div v-if="isRecurring" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frequency
              </label>
              <select
                v-model="frequency"
                class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Adding...' : 'Add Expense' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useExpenseStore } from '../../stores/expenses'
import { useBudgetStore } from '../../stores/budget'

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()

const amount = ref('')
const description = ref('')
const categoryId = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const isRecurring = ref(false)
const frequency = ref('monthly')
const isSubmitting = ref(false)

const emit = defineEmits(['close', 'expense-added'])

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    
    const expenseData = {
      amount: -Math.abs(parseFloat(amount.value)), // Ensure negative for expenses
      description: description.value,
      categoryId: parseInt(categoryId.value),
      date: new Date(date.value).toISOString()
    }

    if (isRecurring.value) {
      await expenseStore.addRecurringExpense({
        ...expenseData,
        frequency: frequency.value
      })
    } else {
      await expenseStore.addExpense(expenseData)
    }

    // Update budget if there's an active one
    const currentBudget = budgetStore.currentBiweeklyBudget
    if (currentBudget) {
      await budgetStore.updateEventBudget(currentBudget.id, {
        spent: currentBudget.spent + Math.abs(parseFloat(amount.value))
      })
    }

    // Check budget alerts
    budgetStore.checkBudgetAlerts()

    // Reset form
    amount.value = ''
    description.value = ''
    categoryId.value = ''
    date.value = new Date().toISOString().split('T')[0]
    isRecurring.value = false
    frequency.value = 'monthly'

    // Emit success event
    emit('expense-added')
  } catch (error) {
    console.error('Error adding expense:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script> 