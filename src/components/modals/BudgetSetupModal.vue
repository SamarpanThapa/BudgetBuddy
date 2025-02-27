<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Budget Setup</h2>
          <button 
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">Biweekly Budget</h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Current Period: {{ currentPeriodLabel }}
            </span>
          </div>

          <form @submit.prevent="handleBiweeklyBudgetSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Budget Amount
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  v-model="biweeklyAmount"
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
                Start Date
              </label>
              <input
                v-model="biweeklyStartDate"
                type="date"
                required
                class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Allocations
              </label>
              <div class="space-y-3">
                <div 
                  v-for="category in expenseStore.allCategories" 
                  :key="category.id"
                  class="flex items-center space-x-4"
                >
                  <div class="flex-1">
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="selectedCategories"
                        :value="category.id"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span class="ml-2">{{ category.icon }} {{ category.name }}</span>
                    </label>
                  </div>
                  <div v-if="selectedCategories.includes(category.id)" class="w-32">
                    <div class="relative">
                      <span class="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        v-model="categoryAllocations[category.id]"
                        type="number"
                        step="0.01"
                        class="block w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
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
                {{ isSubmitting ? 'Saving...' : 'Save Budget' }}
              </button>
            </div>
          </form>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 class="text-lg font-medium mb-4">Savings Goal</h3>
          <form @submit.prevent="handleSavingsGoalSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Savings Target
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  v-model="savingsGoal"
                  type="number"
                  step="0.01"
                  required
                  class="block w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isSubmittingSavings"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmittingSavings ? 'Saving...' : 'Set Savings Goal' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useExpenseStore } from '../../stores/expenses'
import { useBudgetStore } from '../../stores/budget'
import { useSettingsStore } from '../../stores/settings'

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()
const settingsStore = useSettingsStore()

const biweeklyAmount = ref('')
const biweeklyStartDate = ref(new Date().toISOString().split('T')[0])
const selectedCategories = ref([])
const categoryAllocations = ref({})
const savingsGoal = ref('')
const isSubmitting = ref(false)
const isSubmittingSavings = ref(false)

// Initialize with current budget if exists
onMounted(() => {
  const currentBudget = budgetStore.currentBiweeklyBudget
  if (currentBudget) {
    biweeklyAmount.value = currentBudget.amount
    biweeklyStartDate.value = new Date(currentBudget.startDate).toISOString().split('T')[0]
    selectedCategories.value = currentBudget.categories.map(c => c.id)
    currentBudget.categories.forEach(c => {
      categoryAllocations.value[c.id] = c.amount
    })
  }

  savingsGoal.value = budgetStore.savingsGoal
})

const currentPeriodLabel = computed(() => {
  const currentBudget = budgetStore.currentBiweeklyBudget
  if (!currentBudget) return 'No active period'

  const startDate = new Date(currentBudget.startDate)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 13)

  return `${settingsStore.formattedDate(startDate)} - ${settingsStore.formattedDate(endDate)}`
})

const handleBiweeklyBudgetSubmit = async () => {
  try {
    isSubmitting.value = true

    const categories = selectedCategories.value.map(id => ({
      id,
      amount: parseFloat(categoryAllocations.value[id] || 0)
    }))

    await budgetStore.setBiweeklyBudget(
      parseFloat(biweeklyAmount.value),
      new Date(biweeklyStartDate.value).toISOString(),
      categories
    )

    // Reset form
    biweeklyAmount.value = ''
    biweeklyStartDate.value = new Date().toISOString().split('T')[0]
    selectedCategories.value = []
    categoryAllocations.value = {}

    emit('budget-updated')
  } catch (error) {
    console.error('Error setting budget:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleSavingsGoalSubmit = async () => {
  try {
    isSubmittingSavings.value = true
    await budgetStore.setSavingsGoal(parseFloat(savingsGoal.value))
    
    // Reset form
    savingsGoal.value = ''
    
    emit('budget-updated')
  } catch (error) {
    console.error('Error setting savings goal:', error)
  } finally {
    isSubmittingSavings.value = false
  }
}

const emit = defineEmits(['close', 'budget-updated'])
</script> 