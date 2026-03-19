<template>
  <div class="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            create a new account
          </router-link>
        </p>
      </div>

      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue'
</script> 