<template>
  <div class="space-y-8">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Total Spending</h3>
        <p class="text-3xl font-bold text-purple-600">{{ formatCurrency(totalSpending) }}</p>
        <p class="text-sm text-gray-500 mt-2">
          {{ spendingTrend > 0 ? '↑' : '↓' }} {{ Math.abs(spendingTrend) }}% vs last month
        </p>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Biggest Category</h3>
        <p class="text-3xl font-bold text-blue-600">{{ topCategory.name }}</p>
        <p class="text-sm text-gray-500 mt-2">{{ formatCurrency(topCategory.total) }}</p>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Savings Progress</h3>
        <p class="text-3xl font-bold text-green-600">{{ averageSavingsProgress }}%</p>
        <p class="text-sm text-gray-500 mt-2">Across all goals</p>
      </div>
    </div>

    <!-- Expense Breakdown Chart -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold mb-4">Expense Breakdown</h3>
      <div class="h-80">
        <canvas ref="expenseChart"></canvas>
      </div>
    </div>

    <!-- Monthly Trend Chart -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold mb-4">Monthly Spending Trend</h3>
      <div class="h-80">
        <canvas ref="trendChart"></canvas>
      </div>
    </div>

    <!-- Category Analysis -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold mb-4">Category Analysis</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spent</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">% of Budget</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="category in categoryAnalysis" :key="category.id">
              <td class="px-6 py-4 whitespace-nowrap">
                {{ category.icon }} {{ category.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatCurrency(category.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div
                      class="h-2.5 rounded-full"
                      :class="getBudgetProgressColor(category.percentOfBudget)"
                      :style="{ width: \`\${Math.min(category.percentOfBudget * 100, 100)}%\` }"
                    ></div>
                  </div>
                  <span class="text-sm">{{ Math.round(category.percentOfBudget * 100) }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="category.trend > 0 ? 'text-red-600' : 'text-green-600'">
                  {{ category.trend > 0 ? '↑' : '↓' }} {{ Math.abs(category.trend) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cost Saving Suggestions -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold mb-4">Cost Saving Suggestions</h3>
      <div class="space-y-4">
        <div v-for="(suggestion, index) in costSavingSuggestions" :key="index" class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <span class="text-green-500">💡</span>
          </div>
          <div>
            <h4 class="text-lg font-medium">{{ suggestion.title }}</h4>
            <p class="text-gray-600 dark:text-gray-400">{{ suggestion.description }}</p>
            <p v-if="suggestion.potentialSavings" class="text-sm text-green-600 mt-1">
              Potential savings: {{ formatCurrency(suggestion.potentialSavings) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useExpenseStore } from '../stores/expenses'
import { useBudgetStore } from '../stores/budget'
import Chart from 'chart.js/auto'

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()

const expenseChart = ref(null)
const trendChart = ref(null)

// Computed properties
const totalSpending = computed(() => {
  return expenseStore.monthlyExpenses.reduce((total, expense) => total + Math.abs(expense.amount), 0)
})

const spendingTrend = computed(() => {
  // Calculate spending trend percentage compared to last month
  const currentTotal = totalSpending.value
  const lastMonthTotal = expenseStore.getExpensesByDateRange(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(new Date().setMonth(new Date().getMonth()))
  ).reduce((total, expense) => total + Math.abs(expense.amount), 0)
  
  if (lastMonthTotal === 0) return 0
  return ((currentTotal - lastMonthTotal) / lastMonthTotal) * 100
})

const topCategory = computed(() => {
  return expenseStore.expensesByCategory.reduce((max, category) => 
    category.total > max.total ? category : max
  , { total: 0, name: 'None' })
})

const averageSavingsProgress = computed(() => {
  const goals = budgetStore.savingsProgress
  if (goals.length === 0) return 0
  return Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
})

const categoryAnalysis = computed(() => {
  return expenseStore.expensesByCategory.map(category => {
    const budget = budgetStore.currentBiweeklyBudget?.categoryLimits[category.id] || 0
    const lastMonthTotal = expenseStore.getExpensesByDateRange(
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
      new Date(new Date().setMonth(new Date().getMonth()))
    ).filter(expense => expense.categoryId === category.id)
     .reduce((total, expense) => total + Math.abs(expense.amount), 0)

    return {
      ...category,
      percentOfBudget: budget > 0 ? category.total / budget : 0,
      trend: lastMonthTotal > 0 ? ((category.total - lastMonthTotal) / lastMonthTotal) * 100 : 0
    }
  })
})

const costSavingSuggestions = computed(() => {
  const suggestions = []
  const analysis = categoryAnalysis.value

  // Check for categories over budget
  analysis.forEach(category => {
    if (category.percentOfBudget > 1) {
      suggestions.push({
        title: `Reduce ${category.name} Spending`,
        description: `You've exceeded your budget for ${category.name}. Consider setting a stricter limit or finding alternatives.`,
        potentialSavings: category.total - (budgetStore.currentBiweeklyBudget?.categoryLimits[category.id] || 0)
      })
    }
  })

  // Check for recurring expenses
  if (expenseStore.recurringExpenses.length > 0) {
    suggestions.push({
      title: 'Review Subscriptions',
      description: 'You have multiple recurring expenses. Review them to identify any unused subscriptions.',
      potentialSavings: expenseStore.recurringExpenses.reduce((total, expense) => total + Math.abs(expense.amount), 0) * 0.1
    })
  }

  return suggestions
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const getBudgetProgressColor = (percentage) => {
  if (percentage >= 1) return 'bg-red-600'
  if (percentage >= 0.8) return 'bg-yellow-600'
  return 'bg-green-600'
}

// Chart initialization
onMounted(() => {
  // Expense breakdown pie chart
  new Chart(expenseChart.value, {
    type: 'pie',
    data: {
      labels: expenseStore.expensesByCategory.map(c => c.name),
      datasets: [{
        data: expenseStore.expensesByCategory.map(c => c.total),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
          '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })

  // Monthly trend line chart
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    return d.toLocaleString('default', { month: 'short' })
  }).reverse()

  new Chart(trendChart.value, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Monthly Spending',
        data: months.map((_, i) => {
          const startDate = new Date()
          startDate.setMonth(startDate.getMonth() - (5 - i))
          startDate.setDate(1)
          const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
          
          return expenseStore.getExpensesByDateRange(startDate, endDate)
            .reduce((total, expense) => total + Math.abs(expense.amount), 0)
        }),
        borderColor: '#8B5CF6',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
})
</script> 