export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
} 