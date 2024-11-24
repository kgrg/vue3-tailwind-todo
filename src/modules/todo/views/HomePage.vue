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
import { useTodoStore } from '@/modules/todo/store'
import DataTable from '@/modules/todo/components/list/DataTable.vue'
import BaseModel from '@/shared/components/base/BaseModal.vue'
import TodoForm from '@/modules/todo/components/form/TodoForm.vue'
import TodoHeader from '@/modules/todo/components/TodoHeader.vue'
import TodoActionBar from '@/modules/todo/components/TodoActionBar.vue'

const todoStore = useTodoStore()
const isModalOpen = ref(false)
const selectedTodoId = ref(null)

onMounted(() => {
  todoStore.loadTodos()
})

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
</script>

<style scoped>
/* Apply Tailwind CSS classes here */
</style>
