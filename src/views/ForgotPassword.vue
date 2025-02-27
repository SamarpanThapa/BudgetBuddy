<template>
  <div class="min-h-screen flex">
    <!-- Left side - Simplified -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 relative">
      <div class="max-w-lg mx-auto flex flex-col justify-center">
        <!-- Logo -->
        <div class="flex items-center mb-12 transform transition-all duration-300 animate-fade-in-up">
          <div class="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg mr-4">
            <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-2xl font-bold text-white">BudgetBuddy</span>
        </div>
        
        <!-- Simple Content -->
        <h1 class="text-4xl font-bold mb-4 text-white transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 100ms;">
          Password Recovery
        </h1>
        <p class="text-xl text-blue-100 mb-8 transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 200ms;">
          Don't worry, we'll help you get back to managing your finances.
        </p>
        
        <!-- Security Info -->
        <div class="space-y-6 transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 300ms;">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div class="flex items-center space-x-4 mb-4">
              <svg class="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 class="text-xl font-semibold text-white">Secure Recovery Process</h3>
            </div>
            <ul class="space-y-3 text-blue-100">
              <li class="flex items-center">
                <svg class="h-5 w-5 mr-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Email verification
              </li>
              <li class="flex items-center">
                <svg class="h-5 w-5 mr-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Time-limited reset link
              </li>
              <li class="flex items-center">
                <svg class="h-5 w-5 mr-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Encrypted communication
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Password Reset Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8 transform transition-all duration-300 animate-fade-in-up">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
          <p class="text-gray-600">Enter your email address and we'll send you instructions to reset your password.</p>
        </div>

        <!-- Reset Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div class="transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 100ms;">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
              placeholder="Enter your email"
              @input="validateEmail"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600 animate-fade-in">{{ errors.email }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
            style="animation-delay: 200ms;"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending instructions...
            </span>
            <span v-else>Send Reset Instructions</span>
          </button>
        </form>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg transform transition-all duration-300 animate-fade-in-up">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-green-700">Reset instructions have been sent to your email.</p>
          </div>
        </div>

        <!-- Back to Login -->
        <p class="mt-8 text-center text-sm text-gray-600 transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 300ms;">
          Remember your password?
          <router-link to="/login" class="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200">
            Back to login
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrency } from '../composables/useCurrency'

const router = useRouter()

const form = ref({
  email: ''
})

const errors = ref({
  email: ''
})

const isLoading = ref(false)
const showSuccess = ref(false)

const { formatCurrency, currencySymbol } = useCurrency()

// Form validation
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  } else {
    errors.value.email = ''
  }
}

const isFormValid = computed(() => {
  return form.value.email && !errors.value.email
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    isLoading.value = true
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Show success message
    showSuccess.value = true
    
    // Reset form
    form.value.email = ''
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    console.error('Password reset request failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Add hover effects */
input:hover, button:hover {
  transform: translateY(-1px);
}

input:focus, button:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style> 