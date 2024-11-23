<template>
  <section class="bg-gray-50 p-3 antialiased dark:bg-gray-900 sm:p-5">
    <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
      <div
        class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg"
      >
        <TodoHeader title="TODO-CRUD" />
        <TodoActionBar @add-task="openCreateModal" />

        <div class="overflow-x-auto">
          <DataTable
            :rows="todos"
            :columns="columns"
            @edit="openEditModal"
            @delete="handleDeleteTodo"
          />
        </div>
      </div>
    </div>

    <BaseModel :modal-active="isModalOpen" @close-modal="closeModal">
      <TodoForm
        @close-modal="closeModal"
        v-model:todo-id="selectedTodoId"
      />
    </BaseModel>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import DataTable from '@/components/DataTable.vue'
import BaseModel from '@/components/BaseModal.vue'
import TodoForm from '@/components/TodoForm.vue'
import TodoHeader from '@/components/TodoHeader.vue'
import TodoActionBar from '@/components/TodoActionBar.vue'

// State
const isModalOpen = ref(false)
const selectedTodoId = ref(null)
const todoStore = useTodoStore()

// Computed
const todos = computed(() => todoStore.getTodoList)
const columns = computed(() => todoStore.getTodoColumns)

// Methods
const openCreateModal = () => {
  selectedTodoId.value = null
  isModalOpen.value = true
}

const openEditModal = (id) => {
  selectedTodoId.value = id
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedTodoId.value = null
}

const handleDeleteTodo = async (id) => {
  try {
    await todoStore.deleteTodo(id)
  } catch (error) {
    console.error('Failed to delete todo:', error)
    // Here you might want to show an error notification
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await todoStore.loadTodos()
  } catch (error) {
    console.error('Failed to load todos:', error)
    // Here you might want to show an error notification
  }
})
</script>

<style scoped>
/* Apply Tailwind CSS classes here */
</style>
