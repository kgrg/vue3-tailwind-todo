<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <div class="mt-1 relative">
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          :class="{ 'border-red-300': errors.email }"
          placeholder="Enter your email"
        />
        <div v-if="errors.email" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ExclamationCircleIcon class="h-5 w-5 text-red-500" />
        </div>
      </div>
      <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <div class="mt-1 relative">
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          :class="{ 'border-red-300': errors.password }"
          placeholder="Enter your password"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <EyeIcon v-if="showPassword" class="h-5 w-5 text-gray-400" />
          <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
        </button>
      </div>
      <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember"
          v-model="form.remember"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="remember" class="ml-2 block text-sm text-gray-900">Remember me</label>
      </div>

      <div class="text-sm">
        <router-link to="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
          Forgot your password?
        </router-link>
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#2564CF] hover:bg-[#215ABB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2564CF] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SpinnerIcon v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5" />
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.store'
import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import SpinnerIcon from '@/core/icons/SpinnerIcon.vue'
import type { LoginCredentials } from '../types'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const loading = ref(false)
const errors = reactive({
  email: '',
  password: ''
})

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const validateForm = (): boolean => {
  let isValid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    await authStore.login({
      email: form.email,
      password: form.password
    })
    router.push('/')
  } catch (error) {
    errors.password = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script> 