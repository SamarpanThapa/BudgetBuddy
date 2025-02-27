<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Total Balance</h3>
        <p class="text-3xl font-bold" :class="totalBalance >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ settingsStore.formattedCurrency(totalBalance) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Updated {{ settingsStore.formattedDate(new Date()) }}
        </p>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Monthly Income</h3>
        <p class="text-3xl font-bold text-blue-600">
          {{ settingsStore.formattedCurrency(budgetStore.totalMonthlyIncome) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ recurringIncomeCount }} recurring sources
        </p>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Monthly Expenses</h3>
        <p class="text-3xl font-bold text-red-600">
          {{ settingsStore.formattedCurrency(monthlyExpenses) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ expenseStore.monthlyExpenses.length }} transactions this month
        </p>
      </div>
    </div>

    <!-- Budget Progress -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Budget Progress</h3>
          <button 
            @click="showBudgetSetup = true"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Set Budget
          </button>
        </div>
        
        <div v-if="currentBudget" class="space-y-4">
          <div class="flex justify-between mb-2">
            <span>Spent: {{ settingsStore.formattedCurrency(currentBudget.spent) }}</span>
            <span>Budget: {{ settingsStore.formattedCurrency(currentBudget.amount) }}</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="h-2.5 rounded-full transition-all duration-500"
              :class="getBudgetProgressColor(currentBudget.spent / currentBudget.amount)"
              :style="{ width: Math.min((currentBudget.spent / currentBudget.amount) * 100, 100) + '%' }"
            ></div>
          </div>
          <p v-if="isOverBudget" class="text-red-500 dark:text-red-400 text-sm mt-2">
            Warning: You're over budget!
          </p>
        </div>
        <p v-else class="text-gray-500 dark:text-gray-400">No active budget found</p>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Quick Actions</h3>
        <div class="space-y-4">
          <button 
            @click="showAddExpense = true"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Expense
          </button>
          <button 
            @click="showAddIncome = true"
            class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Add Income
          </button>
          <button 
            @click="showBudgetSetup = true"
            class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Manage Budget
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Recent Transactions</h3>
        <router-link 
          to="/transactions" 
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View All
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
            <tr v-for="transaction in recentTransactions" :key="transaction.id" class="hover:bg-gray-50 dark:hover:bg-slate-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ settingsStore.formattedDate(transaction.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex items-center">
                  {{ getCategoryIcon(transaction.categoryId) }}
                  <span class="ml-2">{{ getCategoryName(transaction.categoryId) }}</span>
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ transaction.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="transaction.amount < 0 ? 'text-red-600' : 'text-green-600'">
                {{ settingsStore.formattedCurrency(transaction.amount) }}
              </td>
            </tr>
            <tr v-if="recentTransactions.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
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

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()
const settingsStore = useSettingsStore()

const showAddExpense = ref(false)
const showAddIncome = ref(false)
const showBudgetSetup = ref(false)

// Computed properties
const totalBalance = computed(() => {
  return budgetStore.totalMonthlyIncome - expenseStore.totalExpenses
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

const recurringIncomeCount = computed(() => {
  return budgetStore.recurringIncome.length
})

// Methods
const getBudgetProgressColor = (percentage) => {
  if (percentage >= 1) return 'bg-red-600'
  if (percentage >= 0.8) return 'bg-yellow-600'
  return 'bg-green-600'
}

const getCategoryName = (categoryId) => {
  const category = expenseStore.allCategories.find(c => c.id === categoryId)
  return category ? category.name : 'Uncategorized'
}

const getCategoryIcon = (categoryId) => {
  const category = expenseStore.allCategories.find(c => c.id === categoryId)
  return category ? category.icon : '📋'
}

const onExpenseAdded = () => {
  showAddExpense.value = false
  budgetStore.checkBudgetAlerts()
}

const onIncomeAdded = () => {
  showAddIncome.value = false
}

const onBudgetUpdated = () => {
  showBudgetSetup.value = false
}

onMounted(() => {
  budgetStore.checkBudgetAlerts()
})
</script> 