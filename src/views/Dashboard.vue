<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Total Balance</h3>
          <router-link 
            to="/budget" 
            class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 text-sm"
          >
            View Budget Details →
          </router-link>
        </div>
        <p class="text-3xl font-bold" :class="totalBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
          {{ settingsStore.formattedCurrency(totalBalance) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Updated {{ settingsStore.formattedDate(new Date()) }}
        </p>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Monthly Income</h3>
        <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {{ settingsStore.formattedCurrency(budgetStore.totalMonthlyIncome) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ recurringIncomeCount }} recurring sources
        </p>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Monthly Expenses</h3>
        <p class="text-3xl font-bold text-rose-600 dark:text-rose-400">
          {{ settingsStore.formattedCurrency(monthlyExpenses) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ expenseStore.monthlyExpenses.length }} transactions this month
        </p>
      </div>
    </div>

    <!-- Budget Progress -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Budget Progress</h3>
          <button 
            @click="showBudgetSetup = true"
            class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            Set Budget
          </button>
        </div>
        
        <div v-if="currentBudget" class="space-y-4">
          <div class="flex justify-between mb-2">
            <span class="text-gray-700 dark:text-gray-300">Spent: {{ settingsStore.formattedCurrency(currentBudget.spent) }}</span>
            <span class="text-gray-700 dark:text-gray-300">Budget: {{ settingsStore.formattedCurrency(currentBudget.amount) }}</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5">
            <div
              class="h-2.5 rounded-full transition-all duration-500"
              :class="getBudgetProgressColor(currentBudget.spent / currentBudget.amount)"
              :style="{ width: Math.min((currentBudget.spent / currentBudget.amount) * 100, 100) + '%' }"
            ></div>
          </div>
          <p v-if="isOverBudget" class="text-rose-500 dark:text-rose-400 text-sm mt-2">
            Warning: You're over budget!
          </p>
        </div>
        <p v-else class="text-gray-500 dark:text-gray-400">No active budget found</p>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Quick Actions</h3>
        <div class="space-y-4">
          <button 
            @click="showAddExpense = true"
            class="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Add Expense
          </button>
          <button 
            @click="showAddIncome = true"
            class="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            Add Income
          </button>
          <button 
            @click="showBudgetSetup = true"
            class="w-full bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors duration-200"
          >
            Manage Budget
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 mb-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Transactions</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Your latest financial activities</p>
        </div>
        <router-link 
          to="/transactions" 
          class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-2"
        >
          View All
          <span class="material-icons-outlined text-xl">arrow_forward</span>
        </router-link>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="transaction in recentTransactions" 
                :key="transaction.id" 
                class="hover:bg-gray-50 dark:hover:bg-slate-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ formatDate(transaction.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-xl mr-2">{{ getCategoryIcon(transaction.categoryId) }}</span>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ getCategoryName(transaction.categoryId) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {{ transaction.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" 
                  :class="transaction.type === 'expense' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'">
                {{ settingsStore.formattedCurrency(Math.abs(transaction.amount)) }}
              </td>
            </tr>
            <tr v-if="recentTransactions.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No recent transactions
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <AddExpenseModal 
      v-if="showAddExpense" 
      @close="showAddExpense = false"
      @expense-added="onExpenseAdded"
    />
    <AddIncomeModal 
      v-if="showAddIncome" 
      @close="showAddIncome = false"
      @income-added="onIncomeAdded"
    />
    <BudgetSetupModal 
      v-if="showBudgetSetup" 
      @close="showBudgetSetup = false"
      @budget-updated="onBudgetUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useExpenseStore } from '../stores/expenses'
import { useBudgetStore } from '../stores/budget'
import { useSettingsStore } from '../stores/settings'
import AddExpenseModal from '../components/modals/AddExpenseModal.vue'
import AddIncomeModal from '../components/modals/AddIncomeModal.vue'
import BudgetSetupModal from '../components/modals/BudgetSetupModal.vue'
import { RouterLink } from 'vue-router'

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()
const settingsStore = useSettingsStore()

const showAddExpense = ref(false)
const showAddIncome = ref(false)
const showBudgetSetup = ref(false)

// Computed properties
const totalBalance = computed(() => {
  try {
    const income = budgetStore.totalMonthlyIncome || 0
    const expenses = expenseStore.totalExpenses || 0
    return parseFloat((income - Math.abs(expenses)).toFixed(2))
  } catch (error) {
    console.error('Error calculating total balance:', error)
    return 0
  }
})

const monthlyExpenses = computed(() => {
  try {
    return Math.abs(expenseStore.monthlyExpenses?.reduce((total, expense) => {
      const amount = expense?.amount || 0
      return total + amount
    }, 0) || 0)
  } catch (error) {
    console.error('Error calculating monthly expenses:', error)
    return 0
  }
})

const currentBudget = computed(() => {
  try {
    const budget = budgetStore.currentBiweeklyBudget
    if (!budget) return null

    const startDate = new Date(budget.startDate)
    const now = new Date()
    
    if (isNaN(startDate.getTime())) {
      console.error('Invalid budget start date')
      return null
    }

    const spent = expenseStore.getExpensesByDateRange(startDate, now)
      ?.reduce((total, exp) => total + Math.abs(exp?.amount || 0), 0) || 0

    return {
      ...budget,
      spent: parseFloat(spent.toFixed(2)),
      amount: parseFloat(budget.amount.toFixed(2))
    }
  } catch (error) {
    console.error('Error calculating current budget:', error)
    return null
  }
})

const isOverBudget = computed(() => {
  try {
    if (!currentBudget.value) return false
    return currentBudget.value.spent > currentBudget.value.amount
  } catch (error) {
    console.error('Error checking budget status:', error)
    return false
  }
})

const recurringIncomeCount = computed(() => {
  try {
    return budgetStore.recurringIncome?.length || 0
  } catch (error) {
    console.error('Error calculating recurring income count:', error)
    return 0
  }
})

const recentTransactions = computed(() => {
  try {
    const expenses = expenseStore.expenses || []
    const income = budgetStore.income || []
    
    return [...expenses, ...income]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  } catch (error) {
    console.error('Error getting recent transactions:', error)
    return []
  }
})

// Methods
const getBudgetProgressColor = (progress) => {
  if (progress >= 1) return 'bg-rose-600'
  if (progress >= 0.8) return 'bg-amber-600'
  return 'bg-emerald-600'
}

const formatDate = (date) => {
  try {
    return settingsStore.formattedDate(new Date(date))
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

const getCategoryIcon = (categoryId) => {
  try {
    const category = expenseStore.allCategories?.find(c => c.id === categoryId)
    return category?.icon || '📋'
  } catch (error) {
    console.error('Error getting category icon:', error)
    return '📋'
  }
}

const getCategoryName = (categoryId) => {
  try {
    const category = expenseStore.allCategories?.find(c => c.id === categoryId)
    return category?.name || 'Uncategorized'
  } catch (error) {
    console.error('Error getting category name:', error)
    return 'Uncategorized'
  }
}

// Event handlers with loading states
const showLoading = ref(false)

const onExpenseAdded = () => {
  showAddExpense.value = false
}

const onIncomeAdded = () => {
  showAddIncome.value = false
}

const onBudgetUpdated = () => {
  showBudgetSetup.value = false
}

onMounted(async () => {
  try {
    await expenseStore.initializeStore()
    await budgetStore.checkBudgetAlerts()
  } catch (error) {
    console.error('Error during component initialization:', error)
  }
})
</script> 