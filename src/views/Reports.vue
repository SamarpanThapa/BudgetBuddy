<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
      <div class="mt-4 sm:mt-0">
        <select v-model="selectedPeriod" class="form-select text-sm">
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Income</dt>
                <dd class="text-lg font-semibold text-gray-900">{{ formatCurrency(totalIncome) }}</dd>
                <dd class="text-sm text-gray-500">
                  {{ incomeChange >= 0 ? '↑' : '↓' }} {{ Math.abs(incomeChange) }}% vs previous period
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                <dd class="text-lg font-semibold text-gray-900">{{ formatCurrency(totalExpenses) }}</dd>
                <dd class="text-sm text-gray-500">
                  {{ expenseChange >= 0 ? '↑' : '↓' }} {{ Math.abs(expenseChange) }}% vs previous period
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Net Savings</dt>
                <dd class="text-lg font-semibold text-gray-900">{{ formatCurrency(netSavings) }}</dd>
                <dd class="text-sm text-gray-500">
                  {{ savingsChange >= 0 ? '↑' : '↓' }} {{ Math.abs(savingsChange) }}% vs previous period
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Spending by Category -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">Spending by Category</h3>
          <div class="mt-6">
            <div class="h-80">
              <!-- Placeholder for Category Chart -->
              <div class="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <span class="text-gray-400">Category Chart</span>
              </div>
            </div>
            <div class="mt-6">
              <ul class="grid grid-cols-1 gap-4">
                <li v-for="category in topCategories" :key="category.name"
                    class="flex items-center justify-between py-2">
                  <div class="flex items-center">
                    <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: category.color }"></span>
                    <span class="ml-2 text-sm text-gray-700">{{ category.name }}</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ formatCurrency(category.amount) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Trend -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Monthly Trend</h3>
            <div class="flex items-center space-x-2">
              <button
                v-for="type in ['income', 'expenses']"
                :key="type"
                @click="trendType = type"
                class="px-3 py-1.5 text-xs font-medium rounded-full"
                :class="trendType === type ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:text-gray-700'"
              >
                {{ type.charAt(0).toUpperCase() + type.slice(1) }}
              </button>
            </div>
          </div>
          <div class="mt-6">
            <div class="h-80">
              <!-- Placeholder for Trend Chart -->
              <div class="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <span class="text-gray-400">Trend Chart</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget vs Actual -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">Budget vs Actual</h3>
          <div class="mt-6">
            <div class="h-80">
              <!-- Placeholder for Budget vs Actual Chart -->
              <div class="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <span class="text-gray-400">Budget vs Actual Chart</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Savings Progress -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">Savings Progress</h3>
          <div class="mt-6">
            <div class="h-80">
              <!-- Placeholder for Savings Progress Chart -->
              <div class="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <span class="text-gray-400">Savings Progress Chart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Insights -->
    <div class="bg-white shadow rounded-lg">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900">Key Insights</h3>
        <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="insight in insights" :key="insight.title"
               class="relative bg-white p-6 rounded-lg border border-gray-200">
            <div>
              <span class="inline-flex items-center justify-center p-3 rounded-md"
                    :class="insight.iconBackground">
                <svg class="h-6 w-6" :class="insight.iconForeground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="insight.icon" />
                </svg>
              </span>
              <h3 class="mt-4 text-lg font-medium text-gray-900">{{ insight.title }}</h3>
              <p class="mt-2 text-sm text-gray-500">{{ insight.description }}</p>
            </div>
            <span class="absolute bottom-6 right-6 text-sm font-medium"
                  :class="insight.changeColor">
              {{ insight.change }}
            </span>
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
const selectedPeriod = ref('month')
const trendType = ref('expenses')

// Computed Properties
const totalIncome = computed(() => store.periodIncome)
const totalExpenses = computed(() => store.periodExpenses)
const netSavings = computed(() => totalIncome.value - totalExpenses.value)

const incomeChange = computed(() => store.incomeChange)
const expenseChange = computed(() => store.expenseChange)
const savingsChange = computed(() => store.savingsChange)

const topCategories = computed(() => store.topCategories)

const insights = computed(() => [
  {
    title: 'Highest Expense Category',
    description: 'Housing expenses increased significantly this month',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    iconBackground: 'bg-red-100',
    iconForeground: 'text-red-600',
    change: '+15%',
    changeColor: 'text-red-600'
  },
  {
    title: 'Best Saving Category',
    description: 'Reduced entertainment spending this month',
    icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',
    iconBackground: 'bg-green-100',
    iconForeground: 'text-green-600',
    change: '-30%',
    changeColor: 'text-green-600'
  },
  {
    title: 'Monthly Goal Progress',
    description: 'You\'re on track to meet your savings goal',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBackground: 'bg-blue-100',
    iconForeground: 'text-blue-600',
    change: '85%',
    changeColor: 'text-blue-600'
  }
])

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
</script> 