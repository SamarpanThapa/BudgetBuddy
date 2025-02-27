<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Financial Reports</h1>
      <p class="text-gray-600 dark:text-gray-400">Analyze your spending patterns and financial health</p>
    </div>

    <!-- Time Period Selector -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6 mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button 
            v-for="period in timePeriods" 
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="[
              'px-4 py-2 rounded-lg transition-colors duration-200',
              selectedPeriod === period.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            ]"
          >
            {{ period.label }}
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="downloadReport"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2"
          >
            <span class="material-icons-outlined text-xl">download</span>
            Export Report
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6">
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Total Income</h3>
        <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
          {{ settingsStore.formattedCurrency(totalIncome) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span :class="incomeGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'">
            {{ Math.abs(incomeGrowth) }}%
          </span>
          vs previous period
        </p>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6">
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Total Expenses</h3>
        <p class="text-3xl font-bold text-rose-600 dark:text-rose-400">
          {{ settingsStore.formattedCurrency(totalExpenses) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span :class="expenseGrowth <= 0 ? 'text-emerald-600' : 'text-rose-600'">
            {{ Math.abs(expenseGrowth) }}%
          </span>
          vs previous period
        </p>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6">
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Savings Rate</h3>
        <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {{ savingsRate }}%
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Of total income saved
        </p>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6">
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Budget Adherence</h3>
        <p class="text-3xl font-bold" :class="budgetAdherence >= 80 ? 'text-emerald-600' : 'text-rose-600'">
          {{ budgetAdherence }}%
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Categories within budget
        </p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Income vs Expenses Trend -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Income vs Expenses Trend</h3>
        <div class="h-[400px]">
          <Line
            v-if="incomeVsExpenseData.datasets"
            :data="incomeVsExpenseData"
            :options="lineChartOptions"
          />
        </div>
      </div>

      <!-- Category Distribution -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Expense Distribution</h3>
        <div class="h-[400px]">
          <Doughnut
            v-if="categoryDistributionData.datasets"
            :data="categoryDistributionData"
            :options="doughnutChartOptions"
          />
        </div>
      </div>
    </div>

    <!-- Detailed Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Spending Categories -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Top Spending Categories</h3>
        <div class="space-y-4">
          <div v-for="category in topCategories" :key="category.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-2xl mr-3">{{ category.icon }}</span>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-200">{{ category.name }}</p>
                <p class="text-sm text-gray-500">{{ category.transactionCount }} transactions</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-800 dark:text-gray-200">
                {{ settingsStore.formattedCurrency(category.total) }}
              </p>
              <p class="text-sm" :class="category.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                {{ category.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(category.trend) }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Analysis -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 p-6">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Budget Analysis</h3>
        <div class="space-y-6">
          <div v-for="category in budgetAnalysis" :key="category.id">
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center">
                <span class="text-xl mr-2">{{ category.icon }}</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ category.name }}</span>
              </div>
              <span class="text-sm font-medium" 
                    :class="category.status === 'over' ? 'text-rose-600' : 'text-emerald-600'">
                {{ category.status === 'over' ? 'Over Budget' : 'Within Budget' }}
              </span>
            </div>
            <div class="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="getBudgetProgressColor(category.percentage / 100)"
                :style="{ width: Math.min(category.percentage, 100) + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-sm mt-1">
              <span class="text-gray-600 dark:text-gray-400">
                {{ settingsStore.formattedCurrency(category.spent) }} spent
              </span>
              <span class="text-gray-600 dark:text-gray-400">
                {{ settingsStore.formattedCurrency(category.budget) }} budget
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement
} from 'chart.js'
import { useExpenseStore } from '../stores/expenses'
import { useBudgetStore } from '../stores/budget'
import { useSettingsStore } from '../stores/settings'

// Register ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement
)

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()
const settingsStore = useSettingsStore()

// Time period selection
const timePeriods = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: 'This Year', value: 'year' }
]
const selectedPeriod = ref('30d')

// Computed Properties
const dateRange = computed(() => {
  const end = new Date()
  const start = new Date()

  switch (selectedPeriod.value) {
    case '7d':
      start.setDate(start.getDate() - 7)
      break
    case '30d':
      start.setDate(start.getDate() - 30)
      break
    case '90d':
      start.setDate(start.getDate() - 90)
      break
    case 'year':
      start.setFullYear(start.getFullYear(), 0, 1)
      break
  }

  return { start, end }
})

const periodTransactions = computed(() => {
  const { start, end } = dateRange.value
  const expenses = expenseStore.expenses?.filter(e => {
    const date = new Date(e.date)
    return date >= start && date <= end
  }) || []
  const income = budgetStore.income?.filter(i => {
    const date = new Date(i.date)
    return date >= start && date <= end
  }) || []
  return { expenses, income }
})

const totalIncome = computed(() => {
  return periodTransactions.value.income.reduce((sum, i) => sum + i.amount, 0)
})

const totalExpenses = computed(() => {
  return Math.abs(periodTransactions.value.expenses.reduce((sum, e) => sum + e.amount, 0))
})

const savingsRate = computed(() => {
  if (totalIncome.value === 0) return 0
  return Math.round(((totalIncome.value - totalExpenses.value) / totalIncome.value) * 100)
})

const incomeGrowth = computed(() => {
  // Calculate income growth compared to previous period
  const currentTotal = totalIncome.value
  const previousTotal = getPreviousPeriodIncome()
  if (previousTotal === 0) return 0
  return Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
})

const expenseGrowth = computed(() => {
  // Calculate expense growth compared to previous period
  const currentTotal = totalExpenses.value
  const previousTotal = getPreviousPeriodExpenses()
  if (previousTotal === 0) return 0
  return Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
})

const budgetAdherence = computed(() => {
  const categories = budgetStore.currentBiweeklyBudget?.categories || []
  if (categories.length === 0) return 0
  
  const withinBudget = categories.filter(cat => {
    const spent = getCategorySpent(cat.id)
    return spent <= cat.amount
  }).length

  return Math.round((withinBudget / categories.length) * 100)
})

const topCategories = computed(() => {
  const categories = expenseStore.expensesByCategory || []
  return categories
    .map(cat => {
      const previousTotal = getPreviousPeriodCategoryTotal(cat.id)
      const trend = previousTotal === 0 ? 0 : Math.round(((cat.total - previousTotal) / previousTotal) * 100)
      return {
        ...cat,
        trend,
        transactionCount: periodTransactions.value.expenses.filter(e => e.categoryId === cat.id).length
      }
    })
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
    .slice(0, 5)
})

const budgetAnalysis = computed(() => {
  const budget = budgetStore.currentBiweeklyBudget
  if (!budget) return []

  return budget.categories.map(cat => {
    const spent = getCategorySpent(cat.id)
    const percentage = (spent / cat.amount) * 100
    return {
      id: cat.id,
      name: expenseStore.allCategories.find(c => c.id === cat.id)?.name || 'Uncategorized',
      icon: expenseStore.allCategories.find(c => c.id === cat.id)?.icon || '📋',
      spent,
      budget: cat.amount,
      percentage,
      status: percentage > 100 ? 'over' : 'within'
    }
  })
})

// Chart Data
const incomeVsExpenseData = computed(() => {
  const labels = getDateLabels()
  const incomeData = getIncomeData(labels)
  const expenseData = getExpenseData(labels)

  return {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4
      }
    ]
  }
})

const categoryDistributionData = computed(() => {
  const categories = topCategories.value
  const colors = categories.map((_, index) => {
    const hue = (index * 137.5) % 360
    return {
      bg: `hsla(${hue}, 70%, 50%, 0.8)`,
      border: `hsla(${hue}, 70%, 50%, 1)`
    }
  })

  return {
    labels: categories.map(c => c.name),
    datasets: [{
      data: categories.map(c => Math.abs(c.total)),
      backgroundColor: colors.map(c => c.bg),
      borderColor: colors.map(c => c.border),
      borderWidth: 2
    }]
  }
})

// Chart Options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: value => settingsStore.formattedCurrency(value)
      }
    }
  }
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    }
  }
}

// Helper Functions
function getDateLabels() {
  const { start, end } = dateRange.value
  const labels = []
  const current = new Date(start)
  
  while (current <= end) {
    labels.push(settingsStore.formattedDate(current))
    current.setDate(current.getDate() + 1)
  }
  
  return labels
}

function getIncomeData(labels) {
  const data = new Array(labels.length).fill(0)
  periodTransactions.value.income.forEach(income => {
    const date = settingsStore.formattedDate(new Date(income.date))
    const index = labels.indexOf(date)
    if (index !== -1) {
      data[index] += income.amount
    }
  })
  return data
}

function getExpenseData(labels) {
  const data = new Array(labels.length).fill(0)
  periodTransactions.value.expenses.forEach(expense => {
    const date = settingsStore.formattedDate(new Date(expense.date))
    const index = labels.indexOf(date)
    if (index !== -1) {
      data[index] += Math.abs(expense.amount)
    }
  })
  return data
}

function getPreviousPeriodIncome() {
  const { start, end } = dateRange.value
  const duration = end - start
  const previousStart = new Date(start.getTime() - duration)
  
  return budgetStore.income
    ?.filter(i => {
      const date = new Date(i.date)
      return date >= previousStart && date < start
    })
    .reduce((sum, i) => sum + i.amount, 0) || 0
}

function getPreviousPeriodExpenses() {
  const { start, end } = dateRange.value
  const duration = end - start
  const previousStart = new Date(start.getTime() - duration)
  
  return Math.abs(expenseStore.expenses
    ?.filter(e => {
      const date = new Date(e.date)
      return date >= previousStart && date < start
    })
    .reduce((sum, e) => sum + e.amount, 0) || 0)
}

function getPreviousPeriodCategoryTotal(categoryId) {
  const { start, end } = dateRange.value
  const duration = end - start
  const previousStart = new Date(start.getTime() - duration)
  
  return Math.abs(expenseStore.expenses
    ?.filter(e => {
      const date = new Date(e.date)
      return date >= previousStart && date < start && e.categoryId === categoryId
    })
    .reduce((sum, e) => sum + e.amount, 0) || 0)
}

function getCategorySpent(categoryId) {
  return Math.abs(periodTransactions.value.expenses
    .filter(e => e.categoryId === categoryId)
    .reduce((sum, e) => sum + e.amount, 0))
}

function getBudgetProgressColor(progress) {
  if (progress >= 1) return 'bg-rose-600'
  if (progress >= 0.8) return 'bg-amber-600'
  return 'bg-emerald-600'
}

function downloadReport() {
  // TODO: Implement report download functionality
  console.log('Downloading report...')
}
</script>

<style scoped>
.form-select {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style> 