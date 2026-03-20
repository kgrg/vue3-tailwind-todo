import type { Activity, Habit, Todo, TodoList } from './types.ts'

const activities: Activity[] = [
  {
    id: '1',
    title: 'Morning Standup',
    description: 'Daily team sync meeting',
    category: 'Work',
    date: '2024-03-20',
    time: '09:00',
    location: 'Zoom',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Gym Session',
    description: 'Upper body workout',
    category: 'Health',
    date: '2024-03-20',
    time: '18:00',
    location: 'Fitness Center',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Project Planning',
    description: 'Plan next sprint tasks',
    category: 'Work',
    date: '2024-03-21',
    time: '14:00',
    location: 'Office',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Read Book',
    description: 'Read Clean Code chapter 3',
    category: 'Learning',
    date: '2024-03-21',
    time: '20:00',
    location: 'Home',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Team Lunch',
    description: 'Team building lunch',
    category: 'Work',
    date: '2024-03-22',
    time: '12:30',
    location: 'Restaurant',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
]

const habits: Habit[] = [
  { id: 1, title: 'Observing', image: 'habit_observing.png', startTime: '07:00', endTime: '07:30' },
  { id: 2, title: 'Cooking', image: 'habit_cooking.png', startTime: '09:00', endTime: '10:00' },
  { id: 3, title: 'Self Caring', image: 'habit_selfcaring.png', startTime: '11:00', endTime: '12:00' },
  { id: 4, title: 'Singing', image: 'habit_singing.png', startTime: '14:00', endTime: '14:30' },
  { id: 5, title: 'Reading', image: 'habit_reading.png', startTime: '16:00', endTime: '17:30' },
]

const todos: Todo[] = []

const todoLists: TodoList[] = [
  { id: 'default', name: 'Tasks', icon: '📝' },
  { id: 'important', name: 'Important', icon: '⭐' },
  { id: 'planned', name: 'Planned', icon: '📅' },
]

export const db = {
  activities,
  habits,
  todos,
  todoLists,
}
