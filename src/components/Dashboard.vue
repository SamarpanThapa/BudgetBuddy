<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Total Balance</h3>
        <p class="text-3xl font-bold text-green-600">{{ formatCurrency(totalBalance) }}</p>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Monthly Income</h3>
        <p class="text-3xl font-bold text-blue-600">{{ formatCurrency(budgetStore.totalMonthlyIncome) }}</p>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Monthly Expenses</h3>
        <p class="text-3xl font-bold text-red-600">{{ formatCurrency(monthlyExpenses) }}</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Quick Actions</h3>
        <div class="space-y-4">
          <button @click="showAddExpense = true" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add Expense
          </button>
          <button @click="showAddIncome = true" class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Add Income
          </button>
          <button @click="showBudgetSetup = true" class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            Set Budget
          </button>
        </div>
      </div>

      <!-- Budget Progress -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Current Budget Progress</h3>
        <div v-if="currentBudget" class="space-y-4">
          <div class="flex justify-between mb-2">
            <span>Spent: {{ formatCurrency(currentBudget.spent) }}</span>
            <span>Budget: {{ formatCurrency(currentBudget.amount) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="h-2.5 rounded-full"
              :class="getBudgetProgressColor(currentBudget.spent / currentBudget.amount)"
              :style="{ width: `${(currentBudget.spent / currentBudget.amount) * 100}%` }"
            ></div>
          </div>
          <p v-if="isOverBudget" class="text-red-500 text-sm mt-2">
            Warning: You're over budget!
          </p>
        </div>
        <p v-else class="text-gray-500">No active budget found</p>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold mb-4">Recent Transactions</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="transaction in recentTransactions" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(transaction.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ getCategoryName(transaction.categoryId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap" :class="transaction.amount < 0 ? 'text-red-600' : 'text-green-600'">
                {{ formatCurrency(transaction.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <AddExpenseModal v-if="showAddExpense" @close="showAddExpense = false" />
    <AddIncomeModal v-if="showAddIncome" @close="showAddIncome = false" />
    <BudgetSetupModal v-if="showBudgetSetup" @close="showBudgetSetup = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useExpenseStore } from '../stores/expenses'
import { useBudgetStore } from '../stores/budget'
import AddExpenseModal from './modals/AddExpenseModal.vue'
import AddIncomeModal from './modals/AddIncomeModal.vue'
import BudgetSetupModal from './modals/BudgetSetupModal.vue'

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()

const showAddExpense = ref(false)
const showAddIncome = ref(false)
const showBudgetSetup = ref(false)

// Computed properties
const totalBalance = computed(() => {
  const totalIncome = budgetStore.totalMonthlyIncome
  const totalExpenses = expenseStore.getTotalExpenses()
  return totalIncome - totalExpenses
})

const monthlyExpenses = computed(() => {
  return expenseStore.monthlyExpenses.reduce((total, expense) => total + expense.amount, 0)
})

const currentBudget = computed(() => budgetStore.currentBiweeklyBudget)

const isOverBudget = computed(() => {
  if (!currentBudget.value) return false
  return currentBudget.value.spent > currentBudget.value.amount
})

const recentTransactions = computed(() => {
  return expenseStore.expenses
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getCategoryName = (categoryId) => {
  const category = expenseStore.allCategories.find(c => c.id === categoryId)
  return category ? category.name : 'Uncategorized'
}

const getBudgetProgressColor = (percentage) => {
  if (percentage >= 1) return 'bg-red-600'
  if (percentage >= 0.8) return 'bg-yellow-600'
  return 'bg-green-600'
}
</script>