import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type KnownTodoListId = 'default' | 'important' | 'planned'
type TodoListId = KnownTodoListId | (string & {})

interface TodoList {
  id: TodoListId
  name: string
  icon: string
}

interface Todo {
  id: number
  title: string
  completed: boolean
  important: boolean
  dueDate: string | null
  notes: string
  listId: TodoListId
  createdAt: string
}

interface NewTodoInput {
  title: string
  completed?: boolean
  important?: boolean
  dueDate?: string | null
  notes?: string
  listId?: TodoListId
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const lists = ref<TodoList[]>([
    { id: 'default', name: 'Tasks', icon: '📝' },
    { id: 'important', name: 'Important', icon: '⭐' },
    { id: 'planned', name: 'Planned', icon: '📅' }
  ])
  const activeList = ref<TodoListId>('default')

  const addTodo = (todo: NewTodoInput) => {
    const newTodo: Todo = {
      id: Date.now(),
      title: todo.title,
      completed: todo.completed ?? false,
      important: todo.important ?? false,
      dueDate: todo.dueDate ?? null,
      notes: todo.notes ?? '',
      listId: todo.listId ?? activeList.value,
      createdAt: new Date().toISOString()
    }

    todos.value.push(newTodo)
  }

  const toggleTodo = (id: number) => {
    const todo = todos.value.find(item => item.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const toggleImportant = (id: number) => {
    const todo = todos.value.find(item => item.id === id)
    if (todo) {
      todo.important = !todo.important
    }
  }

  const updateTodo = (id: number, updates: Partial<Todo>) => {
    const index = todos.value.findIndex(item => item.id === id)
    if (index !== -1) {
      todos.value[index] = { ...todos.value[index], ...updates }
    }
  }

  const deleteTodo = (id: number) => {
    todos.value = todos.value.filter(item => item.id !== id)
  }

  const setActiveList = (listId: TodoListId) => {
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
    setActiveList
  }
})
