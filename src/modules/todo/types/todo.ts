export interface Todo {
  id: number
  name: string
  description: string
  status: string
  createdDate: string
  lastModifiedDate: string
}

export interface TodoColumn {
  key: keyof Todo
  label: string
}

export interface TodoState {
  todos: Todo[]
  isLoading: boolean
  error: string | null
}
