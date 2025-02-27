<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Transactions</h1>
        <p class="text-gray-600 dark:text-gray-400">View and manage your financial activities</p>
      </div>
      <div class="flex gap-4">
        <button 
          @click="showAddExpense = true"
          class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200 flex items-center gap-2"
        >
          <span class="material-icons-outlined text-xl">add_circle</span>
          Add Expense
        </button>
        <button 
          @click="showAddIncome = true"
          class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2"
        >
          <span class="material-icons-outlined text-xl">add_circle</span>
          Add Income
        </button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
          <select v-model="dateFilter" class="form-select dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <select v-model="categoryFilter" class="form-select dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="all">All Categories</option>
            <option v-for="category in expenseStore.allCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
          <select v-model="typeFilter" class="form-select dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
          <select v-model="sortBy" class="form-select dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (Highest)</option>
            <option value="amount-asc">Amount (Lowest)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="transaction in filteredTransactions" 
                :key="transaction.id" 
                class="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200">
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
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="transaction.type === 'expense' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'">
                  {{ transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <button @click="editTransaction(transaction)" 
                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                  Edit
                </button>
                <button @click="deleteTransaction(transaction.id)"
                        class="text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300">
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="filteredTransactions.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No transactions found matching your filters
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modals -->
  <AddExpenseModal v-if="showAddExpense" @close="showAddExpense = false" @expense-added="onTransactionAdded" />
  <AddIncomeModal v-if="showAddIncome" @close="showAddIncome = false" @income-added="onTransactionAdded" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useExpenseStore } from '../stores/expenses'
import { useBudgetStore } from '../stores/budget'
import { useSettingsStore } from '../stores/settings'
import AddExpenseModal from '../components/modals/AddExpenseModal.vue'
import AddIncomeModal from '../components/modals/AddIncomeModal.vue'
import { useRouter, useRoute } from 'vue-router'

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()
const settingsStore = useSettingsStore()
const router = useRouter()
const route = useRoute()

// UI State
const showAddExpense = ref(false)
const showAddIncome = ref(false)
const dateFilter = ref('month')
const categoryFilter = ref('all')
const typeFilter = ref('all')
const sortBy = ref('date-desc')
const showLoading = ref(false)

// Watch for route query changes
watch(() => route.query, (newQuery) => {
  if (newQuery.category) {
    categoryFilter.value = newQuery.category
  }
  if (newQuery.type) {
    typeFilter.value = newQuery.type
  }
}, { immediate: true })

// Update URL when filters change
watch([categoryFilter, typeFilter], ([newCategory, newType]) => {
  router.push({
    query: {
      ...route.query,
      category: newCategory === 'all' ? undefined : newCategory,
      type: newType === 'all' ? undefined : newType
    }
  })
})

// Computed Properties
const filteredTransactions = computed(() => {
  try {
    // Get expenses and income, ensuring they are arrays
    const expenses = expenseStore.expenses?.map(e => ({ ...e, type: 'expense' })) || []
    const income = budgetStore.income?.map(i => ({ ...i, type: 'income' })) || []
    
    let transactions = [...expenses, ...income]

    // Apply date filter
    transactions = filterByDate(transactions)

    // Apply category filter
    if (categoryFilter.value !== 'all') {
      transactions = transactions.filter(t => t.categoryId === categoryFilter.value)
    }

    // Apply type filter
    if (typeFilter.value !== 'all') {
      transactions = transactions.filter(t => t.type === typeFilter.value)
    }

    // Apply sorting
    transactions = sortTransactions(transactions)

    return transactions
  } catch (error) {
    console.error('Error filtering transactions:', error)
    return []
  }
})

// Helper Functions
const filterByDate = (transactions) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (dateFilter.value) {
    case 'today':
      return transactions.filter(t => new Date(t.date) >= today)
    case 'week':
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      return transactions.filter(t => new Date(t.date) >= weekStart)
    case 'month':
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      return transactions.filter(t => new Date(t.date) >= monthStart)
    default:
      return transactions
  }
}

const sortTransactions = (transactions) => {
  return transactions.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date)
      case 'date-asc':
        return new Date(a.date) - new Date(b.date)
      case 'amount-desc':
        return Math.abs(b.amount) - Math.abs(a.amount)
      case 'amount-asc':
        return Math.abs(a.amount) - Math.abs(b.amount)
      default:
        return 0
    }
  })
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getCategoryName = (categoryId) => {
  const category = expenseStore.allCategories.find(c => c.id === categoryId)
  return category?.name || 'Uncategorized'
}

const getCategoryIcon = (categoryId) => {
  const category = expenseStore.allCategories.find(c => c.id === categoryId)
  return category?.icon || '📋'
}

const editTransaction = (transaction) => {
  // TODO: Implement edit functionality
  console.log('Edit transaction:', transaction)
}

const deleteTransaction = async (id) => {
  if (!id) {
    console.error('Invalid transaction ID')
    return
  }

  try {
    if (confirm('Are you sure you want to delete this transaction?')) {
      showLoading.value = true
      
      // Determine transaction type
      const transaction = filteredTransactions.value.find(t => t.id === id)
      if (!transaction) {
        throw new Error('Transaction not found')
      }

      if (transaction.type === 'expense') {
        await expenseStore.deleteExpense(id)
      } else if (transaction.type === 'income') {
        await budgetStore.deleteIncome(id)
      }

      // Refresh data in all components
      await Promise.all([
        expenseStore.fetchExpenses(),
        budgetStore.fetchIncome(),
        budgetStore.checkBudgetAlerts()
      ])
    }
  } catch (error) {
    console.error('Error deleting transaction:', error)
  } finally {
    showLoading.value = false
  }
}

const onTransactionAdded = async () => {
  showAddExpense.value = false
  showAddIncome.value = false
  // Refresh data in Dashboard and Budget components
  await budgetStore.checkBudgetAlerts()
}

onMounted(async () => {
  await expenseStore.fetchExpenses()
  await budgetStore.fetchIncome()
})
</script>

<style scoped>
.form-select {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style> 