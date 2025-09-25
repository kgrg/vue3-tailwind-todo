<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <BaseInput
      v-model="form.email"
      type="email"
      label="Email"
      required
      placeholder="Enter your email"
      :error="errors.email"
    />

    <BaseInput
      v-model="form.password"
      :type="showPassword ? 'text' : 'password'"
      label="Password"
      required
      placeholder="Enter your password"
      :error="errors.password"
    >
      <template #right-icon>
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <EyeIcon v-if="showPassword" class="h-5 w-5 text-gray-400" />
          <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
        </button>
      </template>
    </BaseInput>

    <div class="flex items-center justify-between">
      <BaseCheckbox v-model="form.remember" label="Remember me" />

      <div class="text-sm">
        <router-link
          to="/forgot-password"
          class="font-medium text-primary-600 hover:text-primary-500"
        >
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
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import SpinnerIcon from '@/core/icons/SpinnerIcon.vue'
import BaseInput from '@/core/components/BaseInput.vue'
import BaseCheckbox from '@/core/components/BaseCheckbox.vue'
import type { LoginCredentials } from '../types'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const loading = ref(false)
const errors = reactive({
  email: '',
  password: '',
})

const form = reactive({
  email: '',
  password: '',
  remember: false,
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
      password: form.password,
    })
    router.push('/')
  } catch (error) {
    errors.password = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>
