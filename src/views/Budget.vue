<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Budget Overview</h1>
        <p class="mt-1 text-sm text-gray-500">Track and manage your monthly budget</p>
      </div>
      <div class="flex space-x-3">
        <select
          v-model="selectedMonth"
          class="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
        >
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
        <button
          @click="openAddBudgetModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Budget
        </button>
      </div>
    </div>

    <!-- Budget Summary Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Budget Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Budget</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">$4,000</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Spent Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Spent</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">$1,150</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                    28.75%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Remaining Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Remaining</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">$2,850</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    71.25%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Savings Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Savings</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">$500</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    12.5%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Category Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Budget by Category</h3>
        <div class="relative h-80">
          <canvas ref="categoryChart"></canvas>
        </div>
      </div>

      <!-- Category List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Categories</h3>
          <button
            class="text-sm text-blue-600 hover:text-blue-500"
            @click="openAddCategoryModal"
          >
            Add Category
          </button>
        </div>
        <div class="space-y-4">
          <div
            v-for="category in categories"
            :key="category.name"
            class="bg-gray-50 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <div
                  class="w-3 h-3 rounded-full mr-2"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <h4 class="text-sm font-medium text-gray-900">{{ category.name }}</h4>
              </div>
              <div class="text-sm text-gray-500">${{ category.spent }} / ${{ category.budget }}</div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full"
                :style="{
                  width: `${(category.spent / category.budget) * 100}%`,
                  backgroundColor: category.color
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const selectedMonth = ref('March 2024')
const months = [
  'January 2024',
  'February 2024',
  'March 2024',
  'April 2024'
]

const categories = ref([
  {
    name: 'Housing',
    budget: 1500,
    spent: 1500,
    color: '#3B82F6'
  },
  {
    name: 'Food',
    budget: 800,
    spent: 600,
    color: '#10B981'
  },
  {
    name: 'Transportation',
    budget: 400,
    spent: 350,
    color: '#F59E0B'
  },
  {
    name: 'Entertainment',
    budget: 300,
    spent: 200,
    color: '#6366F1'
  },
  {
    name: 'Shopping',
    budget: 500,
    spent: 400,
    color: '#EC4899'
  }
])

const categoryChart = ref(null)

onMounted(() => {
  const ctx = categoryChart.value.getContext('2d')
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories.value.map(c => c.name),
      datasets: [
        {
          data: categories.value.map(c => c.budget),
          backgroundColor: categories.value.map(c => c.color)
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
})

const openAddBudgetModal = () => {
  // Implement add budget modal
  console.log('Opening add budget modal')
}

const openAddCategoryModal = () => {
  // Implement add category modal
  console.log('Opening add category modal')
}
</script> 