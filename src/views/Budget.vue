<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Budget Overview</h1>
          <p class="text-gray-600 dark:text-gray-400">Track your spending and stay on target</p>
        </div>
        <div class="flex gap-4">
          <router-link 
            to="/transactions" 
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
          >
            <span class="material-icons-outlined text-xl"></span>
            View Transactions
          </router-link>
          <button 
            @click="showBudgetSetup = true"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2"
          >
            <span class="material-icons-outlined text-xl"></span>
            Adjust Budget
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 class="text-lg font-medium opacity-90 mb-2">Total Budget</h3>
        <p class="text-3xl font-bold mb-2">{{ settingsStore.formattedCurrency(budgetStore.currentBiweeklyBudget?.amount || 0) }}</p>
        <p class="text-sm opacity-75">Current Period</p>
      </div>

      <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 class="text-lg font-medium opacity-90 mb-2">Remaining</h3>
        <p class="text-3xl font-bold mb-2">{{ settingsStore.formattedCurrency(getRemainingBudget()) }}</p>
        <p class="text-sm opacity-75">Available to spend</p>
      </div>

      <div class="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 class="text-lg font-medium opacity-90 mb-2">Spent</h3>
        <p class="text-3xl font-bold mb-2">{{ settingsStore.formattedCurrency(Math.abs(getTotalSpent())) }}</p>
        <p class="text-sm opacity-75">This period</p>
      </div>

      <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 class="text-lg font-medium opacity-90 mb-2">Savings</h3>
        <p class="text-3xl font-bold mb-2">{{ settingsStore.formattedCurrency(budgetStore.savingsGoal || 0) }}</p>
        <p class="text-sm opacity-75">Monthly Goal</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Budget Progress Chart -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Budget Progress</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Daily spending vs budget limit</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">Spent</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">Budget</span>
            </div>
          </div>
        </div>
        <div class="h-[400px]"> <!-- Increased height for better visibility -->
          <Line
            v-if="progressData.datasets"
            :data="progressData"
            :options="progressOptions"
          />
          <div v-else class="h-full flex items-center justify-center">
            <p class="text-gray-500 dark:text-gray-400">No budget data available</p>
          </div>
        </div>
      </div>

      <!-- Category Distribution Chart -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Expense by Category</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Distribution of your spending</p>
          </div>
        </div>
        <div class="h-[400px] relative"> <!-- Increased height for better visibility -->
          <Doughnut
            v-if="categoryData.datasets && categoryData.labels.length > 0"
            :data="categoryData"
            :options="categoryOptions"
          />
          <div v-else class="h-full flex items-center justify-center">
            <p class="text-gray-500 dark:text-gray-400">No category data available</p>
          </div>
          <div v-if="categoryData.datasets && categoryData.labels.length > 0" class="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-800 p-2 rounded-lg">
            <div class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Spent: {{ settingsStore.formattedCurrency(getTotalSpent()) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Details Table -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Category Breakdown</h3>
        <button 
          @click="showBudgetSetup = true"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Adjust Budget
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allocated</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Spent</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remaining</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="category in categoryDetails" 
                :key="category.id" 
                class="hover:bg-gray-50 dark:hover:bg-slate-700 group cursor-pointer"
                @click="viewCategoryTransactions(category.id)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <span class="text-xl mr-3">{{ category.icon }}</span>
                  <span class="font-medium text-gray-900 dark:text-gray-100">{{ category.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                {{ settingsStore.formattedCurrency(category.allocated) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                {{ settingsStore.formattedCurrency(category.spent) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap" :class="category.remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
                {{ settingsStore.formattedCurrency(category.remaining) }}
              </td>
              <td class="px-6 py-4">
                <div class="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-2 rounded-full transition-all duration-500 group-hover:opacity-80"
                    :class="getProgressColor(category.progress)"
                    :style="{ width: Math.min(category.progress * 100, 100) + '%' }"
                  ></div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                  {{ Math.round(category.progress * 100) }}% used
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Budget Setup Modal -->
  <BudgetSetupModal 
    v-if="showBudgetSetup" 
    @close="showBudgetSetup = false"
    @budget-updated="onBudgetUpdated"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bar, Doughnut, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js'
import { useExpenseStore } from '../stores/expenses'
import { useBudgetStore } from '../stores/budget'
import { useSettingsStore } from '../stores/settings'
import BudgetSetupModal from '../components/modals/BudgetSetupModal.vue'
import { RouterLink } from 'vue-router'

// Register ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement
)

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()
const settingsStore = useSettingsStore()
const router = useRouter()

const showBudgetSetup = ref(false)

// Chart Data with error handling
const monthlyData = computed(() => {
  try {
    const income = budgetStore.totalMonthlyIncome || 0
    const expenses = Math.abs(expenseStore.monthlyExpenses?.reduce((sum, exp) => sum + (exp?.amount || 0), 0) || 0)
    const savings = budgetStore.savingsGoal || 0

    if (isNaN(income) || isNaN(expenses) || isNaN(savings)) {
      console.error('Invalid data in monthly overview')
      return { labels: [], datasets: [] }
    }

    return {
      labels: ['Income', 'Expenses', 'Savings'],
      datasets: [{
        label: 'Monthly Overview',
        data: [income, expenses, savings],
        backgroundColor: [
          'rgba(99, 102, 241, 0.5)',
          'rgba(244, 63, 94, 0.5)',
          'rgba(16, 185, 129, 0.5)'
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(244, 63, 94)',
          'rgb(16, 185, 129)'
        ],
        borderWidth: 1
      }]
    }
  } catch (error) {
    console.error('Error creating monthly data:', error)
    return { labels: [], datasets: [] }
  }
})

// Improved chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 2000,
    easing: 'easeInOutQuart',
    delay: (context) => context.dataIndex * 100
  },
  transitions: {
    active: {
      animation: {
        duration: 400
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12
        },
        color: settingsStore.isDarkMode ? '#f3f4f6' : '#1f2937'
      }
    },
    tooltip: {
      backgroundColor: settingsStore.isDarkMode ? '#1f2937' : 'white',
      titleColor: settingsStore.isDarkMode ? '#f3f4f6' : '#1f2937',
      bodyColor: settingsStore.isDarkMode ? '#f3f4f6' : '#1f2937',
      borderColor: settingsStore.isDarkMode ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      animation: {
        duration: 400
      },
      callbacks: {
        label: (context) => {
          const value = context.raw
          return ` ${settingsStore.formattedCurrency(value)}`
        }
      }
    }
  }
}

const progressOptions = {
  ...commonOptions,
  plugins: {
    ...commonOptions.plugins,
    legend: {
      display: false
    }
  },
  animations: {
    tension: {
      duration: 1000,
      easing: 'linear',
      from: 0.4,
      to: 0.2
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: settingsStore.isDarkMode ? 'rgba(243, 244, 246, 0.1)' : 'rgba(31, 41, 55, 0.1)'
      },
      ticks: {
        color: settingsStore.isDarkMode ? '#f3f4f6' : '#1f2937',
        callback: value => settingsStore.formattedCurrency(value),
        font: {
          size: 11
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: settingsStore.isDarkMode ? '#f3f4f6' : '#1f2937',
        maxRotation: 45,
        minRotation: 45,
        font: {
          size: 11
        }
      }
    }
  }
}

const categoryOptions = {
  ...commonOptions,
  cutout: '65%',
  plugins: {
    ...commonOptions.plugins,
    legend: {
      position: 'right',
      labels: {
        padding: 15,
        usePointStyle: true,
        font: {
          size: 11
        }
      }
    }
  },
  animations: {
    animateRotate: true,
    animateScale: true
  }
}

// Improved category data computation
const categoryData = computed(() => {
  try {
    const categories = expenseStore.expensesByCategory || []
    if (!Array.isArray(categories)) {
      console.error('expensesByCategory is not an array')
      return { labels: [], datasets: [{ data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }] }
    }

    const validCategories = categories
      .filter(c => c && c.name && typeof c.total === 'number' && Math.abs(c.total) > 0)
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
      .slice(0, 8) // Show only top 8 categories for better visibility
    
    if (validCategories.length === 0) {
      return { labels: [], datasets: [{ data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }] }
    }

    const totalSpent = getTotalSpent()
    if (totalSpent === 0) {
      return { labels: [], datasets: [{ data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }] }
    }

    const colors = validCategories.map((_, index) => {
      const hue = (index * 137.5) % 360
      return {
        bg: `hsla(${hue}, 70%, 50%, 0.8)`,
        border: `hsla(${hue}, 70%, 50%, 1)`
      }
    })

    return {
      labels: validCategories.map(c => `${c.name} (${Math.round((Math.abs(c.total) / totalSpent) * 100)}%)`),
      datasets: [{
        data: validCategories.map(c => Math.abs(parseFloat(c.total.toFixed(2)))),
        backgroundColor: colors.map(c => c.bg),
        borderColor: colors.map(c => c.border),
        borderWidth: 2
      }]
    }
  } catch (error) {
    console.error('Error creating category data:', error)
    return { labels: [], datasets: [{ data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }] }
  }
})

const progressData = computed(() => {
  try {
    const currentBudget = budgetStore.currentBiweeklyBudget
    if (!currentBudget) return { datasets: [] }

    const startDate = new Date(currentBudget.startDate)
    if (isNaN(startDate.getTime())) {
      console.error('Invalid budget start date')
      return { datasets: [] }
    }

    const dates = []
    const spent = []
    const budget = []
    
    // Generate last 14 days of data
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (13 - i))
      dates.push(settingsStore.formattedDate(date))
      
      const dailySpent = expenseStore.getExpensesByDateRange(startDate, date)
        ?.reduce((sum, exp) => sum + Math.abs(exp?.amount || 0), 0) || 0
      
      spent.push(parseFloat(dailySpent.toFixed(2)))
      budget.push(parseFloat(((currentBudget.amount / 14) * (i + 1)).toFixed(2)))
    }

    return {
      labels: dates,
      datasets: [
        {
          label: 'Spent',
          data: spent,
          borderColor: 'rgb(244, 63, 94)',
          backgroundColor: 'rgba(244, 63, 94, 0.5)',
          tension: 0.4
        },
        {
          label: 'Budget',
          data: budget,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          tension: 0.4
        }
      ]
    }
  } catch (error) {
    console.error('Error creating progress data:', error)
    return { datasets: [] }
  }
})

const savingsData = computed(() => {
  try {
    const monthlyIncome = budgetStore.totalMonthlyIncome || 0
    const monthlyExpenses = Math.abs(expenseStore.monthlyExpenses?.reduce((sum, exp) => sum + (exp?.amount || 0), 0) || 0)
    const actualSavings = parseFloat((monthlyIncome - monthlyExpenses).toFixed(2))
    const targetSavings = budgetStore.savingsGoal || 0

    return {
      labels: ['Current Month'],
      datasets: [
        {
          label: 'Actual Savings',
          data: [actualSavings],
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1
        },
        {
          label: 'Target Savings',
          data: [targetSavings],
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1
        }
      ]
    }
  } catch (error) {
    console.error('Error creating savings data:', error)
    return { labels: [], datasets: [] }
  }
})

// Enhanced category details computation
const categoryDetails = computed(() => {
  try {
    const currentBudget = budgetStore.currentBiweeklyBudget
    if (!currentBudget) return []

    return currentBudget.categories
      .filter(cat => cat && cat.id)
      .map(cat => {
        const category = expenseStore.allCategories?.find(c => c.id === cat.id)
        const transactions = expenseStore.expenses
          ?.filter(e => e && e.categoryId === cat.id)
        const spent = transactions
          ?.reduce((sum, exp) => sum + Math.abs(exp?.amount || 0), 0) || 0
        
        const allocated = parseFloat(cat.amount.toFixed(2))
        const spentAmount = parseFloat(spent.toFixed(2))
        const transactionCount = transactions?.length || 0
        
        return {
          id: cat.id,
          name: category?.name || 'Uncategorized',
          icon: category?.icon || '📋',
          allocated,
          spent: spentAmount,
          remaining: parseFloat((allocated - spentAmount).toFixed(2)),
          progress: allocated > 0 ? spentAmount / allocated : 0,
          transactionCount,
          lastTransaction: transactions?.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        }
      })
      .sort((a, b) => b.spent - a.spent)
  } catch (error) {
    console.error('Error calculating category details:', error)
    return []
  }
})

const getProgressColor = (progress) => {
  if (progress >= 1) return 'bg-rose-600 dark:bg-rose-500'
  if (progress >= 0.8) return 'bg-amber-600 dark:bg-amber-500'
  return 'bg-emerald-600 dark:bg-emerald-500'
}

// Helper functions with error handling
const getTotalSpent = () => {
  try {
    const currentBudget = budgetStore.currentBiweeklyBudget
    if (!currentBudget) return 0

    const startDate = new Date(currentBudget.startDate)
    if (isNaN(startDate.getTime())) return 0

    const spent = expenseStore.getExpensesByDateRange(startDate, new Date())
      ?.reduce((total, exp) => total + (exp?.amount || 0), 0) || 0

    return parseFloat(spent.toFixed(2))
  } catch (error) {
    console.error('Error calculating total spent:', error)
    return 0
  }
}

const getRemainingBudget = () => {
  try {
    const currentBudget = budgetStore.currentBiweeklyBudget
    if (!currentBudget) return 0

    const spent = getTotalSpent()
    return parseFloat((currentBudget.amount - Math.abs(spent)).toFixed(2))
  } catch (error) {
    console.error('Error calculating remaining budget:', error)
    return 0
  }
}

// Event handlers with loading state
const showLoading = ref(false)

const onBudgetUpdated = async () => {
  showLoading.value = true
  try {
    showBudgetSetup.value = false
    await budgetStore.checkBudgetAlerts()
  } catch (error) {
    console.error('Error handling budget update:', error)
  } finally {
    showLoading.value = false
  }
}

// Add method to navigate to transactions filtered by category
const viewCategoryTransactions = (categoryId) => {
  router.push({
    path: '/transactions',
    query: { 
      category: categoryId,
      type: 'expense'
    }
  })
}

onMounted(async () => {
  try {
    await budgetStore.checkBudgetAlerts()
  } catch (error) {
    console.error('Error during component initialization:', error)
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  margin: auto;
}
</style> 