export interface Habit {
  id: number
  title: string
  image: string
  startTime: string
  endTime: string
}

export interface HabitState {
  habits: Habit[]
  loading: boolean
  error: string | null
} 