<template>
  <form @submit.prevent="performAction">
    <div class="mb-4 grid gap-4 sm:grid-cols-2">
      <TodoInput
        label="Name"
        id="name"
        v-model="todo.name"
        placeholder="Type task name"
        required
      />
      <TodoTextBox
        label="Name"
        id="name"
        v-model="todo.description"
        placeholder="Type task name"
        required
      />
      <TodoDropdown
        label="Name"
        id="name"
        v-model="todo.status"
        :options="statusList"
        placeholder="Type task name"
        required
      />
    </div>
    <button
      type="submit"
      class="inline-flex items-center rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    >
      {{ props.todoId ? 'Update' : 'Add' }} Task
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import TodoInput from './Form/TodoInput.vue'
import TodoTextBox from './Form/TodoTextBox.vue'
import TodoDropdown from './Form/TodoDropdown.vue'

// Add TypeScript interface for todo
interface TodoFormData {
  name: string
  description: string
  status: string
}

// Initialize with proper typing
const todo = ref<TodoFormData>({
  name: '',
  description: '',
  status: 'todo'
})

// Add proper typing for emit
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
const tasksStore = useTodoStore()

const statusList = [
  { text: 'Todo', value: 'todo' },
  { text: 'In Progress', value: 'in-progress' },
  { text: 'Done', value: 'done' }
]

// Add error handling
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
    // Add error handling UI feedback
  }
}

const addTask = () => {
  tasksStore.createTodo({ ...todo.value, id: Date.now() })
  resetTodo()
}

const updateTask = () => {
  tasksStore.updateTodo({ ...todo.value })
  resetTodo()
}

const resetTodo = () => {
  todo.value = {}
}

onMounted(() => {
  if (props.todoId) {
    const fetchedTodo = tasksStore.getTodoById(props.todoId)
    todo.value = { ...fetchedTodo }
  }
})
</script>

<style lang="scss" scoped></style>
