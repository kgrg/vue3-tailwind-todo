import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])
  const lists = ref([
    { id: 'default', name: 'Tasks', icon: '📝' },
    { id: 'important', name: 'Important', icon: '⭐' },
    { id: 'planned', name: 'Planned', icon: '📅' },
  ])
  const activeList = ref('default')

  const addTodo = (todo) => {
    todos.value.push({
      id: Date.now(),
      title: todo.title,
      completed: false,
      important: false,
      dueDate: todo.dueDate || null,
      notes: todo.notes || '',
      listId: todo.listId || activeList.value,
      createdAt: new Date().toISOString(),
    })
  }

  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const toggleImportant = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.important = !todo.important
    }
  }

  const updateTodo = (id, updates) => {
    const index = todos.value.findIndex(t => t.id === id)
    if (index !== -1) {
      todos.value[index] = { ...todos.value[index], ...updates }
    }
  }

  const deleteTodo = (id) => {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  const setActiveList = (listId) => {
    activeList.value = listId
  }

  const filteredTodos = computed(() => {
    if (activeList.value === 'important') {
      return todos.value.filter(todo => todo.important)
    }
    if (activeList.value === 'planned') {
      return todos.value.filter(todo => todo.dueDate)
    }
    return todos.value.filter(todo => todo.listId === activeList.value)
  })

  return {
    todos,
    lists,
    activeList,
    filteredTodos,
    addTodo,
    toggleTodo,
    toggleImportant,
    updateTodo,
    deleteTodo,
    setActiveList,
  }
}) 