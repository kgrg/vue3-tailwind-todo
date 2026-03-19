<template>
  <main class="flex-1 min-h-screen overflow-y-auto bg-white">
    <div class="max-w-3xl mx-auto p-6">
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">{{ activeListName }}</h2>
        <div class="bg-white rounded-lg shadow-sm border border-todo-border">
          <div class="p-4 flex items-center space-x-4">
            <button
              class="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-todo-blue flex items-center justify-center transition-colors duration-200"
              @click="addNewTodo"
            >
              <span class="text-gray-400 text-xl leading-none">+</span>
            </button>
            <input
              v-model="newTodoTitle"
              type="text"
              placeholder="Add a task"
              class="flex-1 outline-none text-gray-700 placeholder-gray-400"
              @keyup.enter="addNewTodo"
            />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <BaseListItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          customClass="hover:bg-todo-gray"
        >
          <template #leading>
            <button
              @click="toggleTodo(todo.id)"
              :class="[
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200',
                todo.completed
                  ? 'bg-todo-blue border-todo-blue'
                  : 'border-gray-300 hover:border-todo-blue'
              ]"
            >
              <span v-if="todo.completed" class="text-white text-sm">✓</span>
            </button>
          </template>

          <template #title>
            <p :class="[
              'text-gray-700 truncate',
              todo.completed && 'line-through text-gray-400'
            ]">
              {{ todo.title }}
            </p>
          </template>

          <template #description>
            <p v-if="todo.dueDate" class="text-sm text-gray-500">
              Due {{ new Date(todo.dueDate).toLocaleDateString() }}
            </p>
          </template>

          <template #actions>
            <button
              @click="toggleImportant(todo.id)"
              class="text-gray-400 hover:text-yellow-500"
            >
              <span class="text-xl">{{ todo.important ? '⭐' : '☆' }}</span>
            </button>
          </template>
        </BaseListItem>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { storeToRefs } from 'pinia'
import BaseListItem from '@/core/components/BaseListItem.vue'

const todoStore = useTodoStore()
const { filteredTodos, lists, activeList } = storeToRefs(todoStore)
const { addTodo, toggleTodo, toggleImportant } = todoStore

const newTodoTitle = ref('')

const activeListName = computed(() => {
  const currentList = lists.value.find(l => l.id === activeList.value)
  return currentList ? currentList.name : 'Tasks'
})

const addNewTodo = () => {
  if (newTodoTitle.value.trim()) {
    addTodo({
      title: newTodoTitle.value,
      completed: false,
      important: false
    })
    newTodoTitle.value = ''
  }
}
</script> 
