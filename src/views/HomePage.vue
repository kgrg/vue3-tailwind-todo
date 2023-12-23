<template>
  <!-- Start block -->
  <section class="bg-gray-50 p-3 antialiased dark:bg-gray-900 sm:p-5">
    <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
      <!-- Start coding here -->
      <div
        class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg"
      >
        <nav
          class="flex flex-col items-start justify-between space-y-3 p-4 md:flex-row md:items-center md:space-y-0"
          aria-label="Table navigation"
        >
          <h2
            class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-4xl"
          >
            TODO-CRUD
          </h2>
        </nav>

        <div
          class="flex flex-col items-center justify-between space-y-3 p-4 md:flex-row md:space-x-4 md:space-y-0"
        >
          <div
            class="flex w-full flex-shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-x-3 md:space-y-0"
          >
            <button
              type="button"
              id="createProductModalButton"
              data-modal-target="createProductModal"
              data-modal-toggle="createProductModal"
              class="flex items-center justify-center rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              @click="toggleModal"
            >
              Add Task
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <DataTable
            :rows="rows"
            :columns="columns"
            @edit="openEditModal"
            @delete="deleteTodo"
          />
        </div>
      </div>
    </div>
    <BaseModel :modalActive="modalActive" @close-modal="toggleModal">
      <TodoForm @close-modal="toggleModal" v-model:todoId="todoId" />
    </BaseModel>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import BaseModel from '@/components/BaseModal.vue'
import TodoForm from '@/components/TodoForm.vue'

import { useTodoStore } from '@/stores/todo'

const modalActive = ref(null)
const todoId = ref(null)

const tasksStore = useTodoStore()

const columns = computed(() => tasksStore.getTodoColumns)

const rows = computed(() => tasksStore.getTodoList)

const toggleModal = () => {
  modalActive.value = !modalActive.value
  if (!modalActive.value) {
    todoId.value = null
  }
}

const openEditModal = (id) => {
  todoId.value = id
  toggleModal()
}

const deleteTodo = (id) => {
  tasksStore.deleteTodo(id)
}

onMounted(() => {
  tasksStore.loadTodos()
})
</script>

<style scoped>
/* Apply Tailwind CSS classes here */
</style>
