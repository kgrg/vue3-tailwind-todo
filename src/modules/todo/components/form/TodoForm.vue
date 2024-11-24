<template>
  <div class="relative p-4 md:p-5">
    <div class="grid gap-4 mb-4 grid-cols-2">
      <TodoInput
        id="name"
        label="Task Name"
        v-model="todo.name"
        placeholder="Type task name"
        required
      />
      <TodoDropdown
        v-model="todo.status"
        :options="statusList"
      />
      <TodoTextBox
        v-model="todo.description"
      />
    </div>
    <button
      type="submit"
      @click="performAction"
      class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      {{ props.todoId ? 'Update' : 'Add' }} task
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/modules/todo/store'
import TodoInput from './TodoInput.vue'
import TodoTextBox from './TodoTextBox.vue'
import TodoDropdown from './TodoDropdown.vue'
import type { Todo } from '@/modules/todo/types/todo'

interface TodoFormData {
  name: string
  description: string
  status: string
}

const todo = ref<TodoFormData>({
  name: '',
  description: '',
  status: 'todo'
})

const emit = defineEmits<{
  (e: 'close-modal'): void
  (e: 'update:todoId', value: number | null): void
}>()

const props = defineProps({
  todoId: {
    type: Number,
    default: null
  }
})

const todoStore = useTodoStore()

const statusList = [
  { text: 'Todo', value: 'todo' },
  { text: 'In Progress', value: 'in-progress' },
  { text: 'Done', value: 'done' }
]

onMounted(() => {
  if (props.todoId) {
    const existingTodo = todoStore.getTodoById(props.todoId)
    if (existingTodo) {
      todo.value = {
        name: existingTodo.name,
        description: existingTodo.description,
        status: existingTodo.status
      }
    }
  }
})

const addTask = async () => {
  await todoStore.createTodo(todo.value)
  todo.value = { name: '', description: '', status: 'todo' }
}

const updateTask = async () => {
  if (!props.todoId) return

  await todoStore.updateTodo({
    id: props.todoId,
    ...todo.value,
    createdDate: '', // Will be handled by the store
    lastModifiedDate: '' // Will be handled by the store
  } as Todo)
}

const performAction = async () => {
  try {
    if (props.todoId) {
      await updateTask()
    } else {
      await addTask()
    }
    emit('close-modal')
  } catch (error) {
    console.error('Error performing todo action:', error)
  }
}
</script>
