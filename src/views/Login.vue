<template>
  <div class="min-h-screen flex">
    <!-- Left side - Simplified -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 relative">
      <div class="max-w-lg mx-auto flex flex-col justify-center">
        <!-- Logo -->
        <div class="flex items-center mb-12">
          <div class="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg mr-4">
            <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-2xl font-bold text-white">BudgetBuddy</span>
        </div>
        
        <!-- Simple Content -->
        <h1 class="text-4xl font-bold mb-4 text-white">
          Smart Money Management
        </h1>
        <p class="text-xl text-blue-100 mb-8">
          Join thousands of users who trust BudgetBuddy for their financial journey.
        </p>
        
        <!-- Simple Stats -->
        <div class="grid grid-cols-2 gap-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div class="text-3xl font-bold text-white">10k+</div>
            <div class="text-blue-200">Active Users</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div class="text-3xl font-bold text-white">98%</div>
            <div class="text-blue-200">Success Rate</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6">
      <div class="w-full max-w-sm transform transition-all duration-300 animate-fade-in-up">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center animate-fade-in">Welcome Back!</h2>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 100ms;">
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
              placeholder="Email address"
              @input="validateEmail"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600 animate-fade-in">{{ errors.email }}</p>
          </div>

          <div class="transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 200ms;">
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                placeholder="Password"
                @input="validatePassword"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center transition-opacity duration-200"
                @click="togglePassword"
              >
                <svg
                  :class="showPassword ? 'hidden' : 'block'"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg
                  :class="showPassword ? 'block' : 'hidden'"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600 animate-fade-in">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between text-sm transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 300ms;">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="form.rememberMe"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
              />
              <span class="ml-2 text-gray-600">Remember me</span>
            </label>
            <router-link to="/forgot-password" class="text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Forgot password?
            </router-link>
          </div>

          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
            style="animation-delay: 400ms;"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <div class="relative my-8 transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 500ms;">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">or continue with</span>
          </div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-4 transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 600ms;">
          <button
            type="button"
            @click="handleGoogleLogin"
            class="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-[1.02]"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c2.17 0 4.1.78 5.63 2.07l2.83-2.83C18.37 2.4 15.37 1 12 1 7.36 1 3.37 3.54 1.33 7.33l3.31 2.57C5.87 6.42 8.69 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23 12c0-.89-.08-1.74-.22-2.57H12v4.87h6.16c-.27 1.43-1.1 2.64-2.34 3.45l3.66 2.84c2.14-1.98 3.37-4.9 3.37-8.59z"/>
              <path fill="#FBBC05" d="M5 12c0-1.08.22-2.11.64-3.05L2.33 6.38C1.49 8.12 1 10 1 12s.49 3.88 1.33 5.62l3.31-2.57C5.22 14.11 5 13.08 5 12z"/>
              <path fill="#34A853" d="M12 19c3.31 0 6.13-1.38 8.16-3.73l-3.66-2.84c-1.01.68-2.31 1.08-3.69 1.08-3.31 0-6.13-2.19-7.14-5.14L2.33 11c2.04 3.79 6.03 6.33 9.67 6.33z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            @click="handleFacebookLogin"
            class="flex items-center justify-center gap-3 px-4 py-3 border border-transparent rounded-lg text-white bg-[#1877F2] hover:bg-[#166fe5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] transition-all duration-300 hover:scale-[1.02]"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <p class="mt-8 text-center text-sm text-gray-600 transform transition-all duration-300 animate-fade-in-up" style="animation-delay: 700ms;">
          Don't have an account?
          <router-link to="/register" class="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200">
            Sign up for free
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)

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

const validatePassword = () => {
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  } else {
    errors.value.password = ''
  }
}

const isFormValid = computed(() => {
  return form.value.email && 
         form.value.password && 
         !errors.value.email && 
         !errors.value.password
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    isLoading.value = true
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData = {
      email: form.value.email
    }
    
    authStore.setUser(userData)
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    const userData = {
      email: 'google.user@example.com',
      provider: 'google'
    }
    authStore.setUser(userData)
    router.push('/')
  } catch (error) {
    console.error('Google login failed:', error)
  }
}

const handleFacebookLogin = async () => {
  try {
    const userData = {
      email: 'facebook.user@example.com',
      provider: 'facebook'
    }
    authStore.setUser(userData)
    router.push('/')
  } catch (error) {
    console.error('Facebook login failed:', error)
  }
}
</script>

<style scoped>
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.stats-card {
  @apply bg-white/10 backdrop-blur-lg rounded-2xl p-6 relative transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer;
}

.testimonial-card {
  @apply relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl border border-white/10;
}

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