import { defineStore } from 'pinia'

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
  dueDate?: string | null
  notes?: string
  listId?: TodoListId
}

interface TodoState {
  todos: Todo[]
  lists: TodoList[]
  activeList: TodoListId
}

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    todos: [],
    lists: [
      { id: 'default', name: 'Tasks', icon: '📝' },
      { id: 'important', name: 'Important', icon: '⭐' },
      { id: 'planned', name: 'Planned', icon: '📅' }
    ],
    activeList: 'default'
  }),

  const addTodo = (todo: NewTodoInput) => {
    const newTodo: Todo = {
      id: Date.now(),
      title: todo.title,
      completed: false,
      important: false,
      dueDate: todo.dueDate ?? null,
      notes: todo.notes ?? '',
      listId: todo.listId ?? activeList.value,
      createdAt: new Date().toISOString()
    }
  },

  actions: {
    addTodo(todo: NewTodoInput) {
      const newTodo: Todo = {
        id: Date.now(),
        title: todo.title,
        completed: todo.completed ?? false,
        important: todo.important ?? false,
        dueDate: todo.dueDate ?? null,
        notes: todo.notes ?? '',
        listId: todo.listId ?? this.activeList,
        createdAt: new Date().toISOString()
      }

      this.todos.push(newTodo)
    },

    toggleTodo(id: number) {
      const todo = this.todos.find(item => item.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    },

    toggleImportant(id: number) {
      const todo = this.todos.find(item => item.id === id)
      if (todo) {
        todo.important = !todo.important
      }
    },

    updateTodo(id: number, updates: Partial<Todo>) {
      const index = this.todos.findIndex(item => item.id === id)
      if (index !== -1) {
        this.todos[index] = { ...this.todos[index], ...updates }
      }
    },

    deleteTodo(id: number) {
      this.todos = this.todos.filter(item => item.id !== id)
    },

    setActiveList(listId: TodoListId) {
      this.activeList = listId
    }
  }
})
