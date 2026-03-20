export type ActivityCategory = 'Work' | 'Personal' | 'Learning' | 'Health' | 'Other'

export interface Activity {
  id: string
  title: string
  description: string
  category: ActivityCategory
  date: string
  time: string
  location?: string
  status: 'completed' | 'pending'
  createdAt: string
}

export interface Habit {
  id: number
  title: string
  image: string
  startTime: string
  endTime: string
}

export type TodoListId = 'default' | 'important' | 'planned' | (string & {})

export interface Todo {
  id: number
  title: string
  completed: boolean
  important: boolean
  dueDate: string | null
  notes: string
  listId: TodoListId
  createdAt: string
}

export interface TodoList {
  id: TodoListId
  name: string
  icon: string
}
