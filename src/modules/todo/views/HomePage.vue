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

    <BaseModel
      :modal-active="isModalOpen"
      :modal-title="selectedTodoId ? 'Edit Task' : 'Add Task'"
      @close-modal="closeModal"
    >
      <TodoForm
        @close-modal="closeModal"
        :todo-id="selectedTodoId"
      />
    </BaseModel>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from '@/modules/todo/store'
import DataTable from '@/modules/todo/components/list/DataTable.vue'
import BaseModel from '@/shared/components/base/BaseModal.vue'
import TodoForm from '@/modules/todo/components/form/TodoForm.vue'
import TodoHeader from '@/modules/todo/components/TodoHeader.vue'
import TodoActionBar from '@/modules/todo/components/TodoActionBar.vue'
import type { Todo } from '@/modules/todo/types/todo'

const todoStore = useTodoStore()
const isModalOpen = ref<boolean>(false)
const selectedTodoId = ref<number | undefined>(undefined)

onMounted(() => {
  todoStore.loadTodos()
})

// Computed
const todos = computed<Todo[]>(() => todoStore.getTodoList)
const columns = computed(() => todoStore.getTodoColumns)

// Methods
const openCreateModal = (): void => {
  selectedTodoId.value = undefined
  isModalOpen.value = true
}

const openEditModal = (id: number): void => {
  selectedTodoId.value = id
  isModalOpen.value = true
}

const closeModal = (): void => {
  isModalOpen.value = false
  selectedTodoId.value = undefined
}

const handleDeleteTodo = async (id: number): Promise<void> => {
  try {
    await todoStore.deleteTodo(id)
  } catch (error) {
    console.error('Failed to delete todo:', error)
  }
}
</script>

<style scoped>
/* Apply Tailwind CSS classes here */
</style>
