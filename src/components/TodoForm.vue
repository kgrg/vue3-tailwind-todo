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

<script setup>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import TodoInput from './Form/TodoInput.vue'
import TodoTextBox from './Form/TodoTextBox.vue'
import TodoDropdown from './Form/TodoDropdown.vue'

const emit = defineEmits(['close-modal'])

const props = defineProps({
  todoId: {
    type: Number,
    default: null
  }
})
const tasksStore = useTodoStore()
const todo = ref({
  name: '',
  description: '',
  status: 'todo'
})

const statusList = [
  { text: 'Todo', value: 'todo' },
  { text: 'In Progress', value: 'in-progress' },
  { text: 'Done', value: 'done' }
]

const performAction = () => {
  if (props.todoId) {
    updateTask()
  } else {
    addTask()
  }
}

const addTask = () => {
  tasksStore.createTodo({ ...todo.value, id: Date.now() })
  resetTodo()
  emit('close-modal')
}

const updateTask = () => {
  tasksStore.updateTodo({ ...todo.value })
  resetTodo()
  emit('close-modal')
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
