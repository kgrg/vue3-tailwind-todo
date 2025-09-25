<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Today Activities</h1>
      <p class="mt-1 text-sm text-gray-500">Manage your habits, reminders, events, activities.</p>
    </div>

    <!-- Habits Section -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-gray-900">Your Habits</h2>
        <button class="btn-primary">Add Habit</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <HabitCard v-for="habit in habits" :key="habit.id" v-bind="habit" />
      </div>
    </section>

    <!-- Reminders Section -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-gray-900">Reminders</h2>
      </div>
      <div class="space-y-4">
        <TaskItem
          v-for="reminder in reminders"
          :key="reminder.id"
          v-bind="reminder"
          @toggle-complete="toggleReminder(reminder.id)"
          @toggle-important="toggleImportant(reminder.id)"
          @edit="editReminder(reminder.id)"
          @delete="deleteReminder(reminder.id)"
        />
      </div>
    </section>

    <!-- To Do List -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-gray-900">To Do List</h2>
        <div class="flex items-center gap-2">
          <button
            v-for="status in ['To Do', 'In Progress', 'Completed']"
            :key="status"
            class="px-3 py-1 text-sm rounded-md"
            :class="[
              activeStatus === status
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
            ]"
            @click="activeStatus = status"
          >
            {{ status }}
            <span class="ml-1 text-xs">
              {{ getTaskCountByStatus(status) }}
            </span>
          </button>
        </div>
      </div>
      <div class="space-y-4">
        <TaskItem
          v-for="task in filteredTasks"
          :key="task.id"
          v-bind="task"
          @toggle-complete="toggleTask(task.id)"
          @toggle-important="toggleImportant(task.id)"
          @edit="editTask(task.id)"
          @delete="deleteTask(task.id)"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import HabitCard from '../components/habits/HabitCard.vue'
import TaskItem from '../components/tasks/TaskItem.vue'

// Sample data
const habits = ref([
  {
    id: 1,
    title: 'Observing',
    imageUrl: '/images/habits/observing.jpg',
    startTime: '07:00',
    endTime: '07:30',
  },
  {
    id: 2,
    title: 'Cooking',
    imageUrl: '/images/habits/cooking.jpg',
    startTime: '09:00',
    endTime: '10:00',
  },
  // Add more habits...
])

const reminders = ref([
  {
    id: 1,
    title: 'Gym Session Week 3',
    description: 'Day for biceps, legs, and back.',
    tag: { label: 'work', color: 'gray' },
    dueDate: new Date('2024-04-18T15:00:00'),
    isCompleted: false,
    isImportant: true,
  },
  // Add more reminders...
])

const tasks = ref([
  {
    id: 1,
    title: 'UX Researching - Phase 2',
    description: 'Conduct user interview with 3 participants',
    tag: { label: 'work', color: 'gray' },
    status: 'To Do',
    isCompleted: false,
    isImportant: false,
  },
  // Add more tasks...
])

const activeStatus = ref('To Do')

const filteredTasks = computed(() => {
  return tasks.value.filter(task => task.status === activeStatus.value)
})

const getTaskCountByStatus = status => {
  return tasks.value.filter(task => task.status === status).length
}

// Event handlers
const toggleReminder = id => {
  const reminder = reminders.value.find(r => r.id === id)
  if (reminder) {
    reminder.isCompleted = !reminder.isCompleted
  }
}

const toggleTask = id => {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.isCompleted = !task.isCompleted
    task.status = task.isCompleted ? 'Completed' : 'To Do'
  }
}

const toggleImportant = id => {
  const item = [...reminders.value, ...tasks.value].find(i => i.id === id)
  if (item) {
    item.isImportant = !item.isImportant
  }
}

const editReminder = id => {
  // Implement edit functionality
}

const deleteReminder = id => {
  reminders.value = reminders.value.filter(r => r.id !== id)
}

const editTask = id => {
  // Implement edit functionality
}

const deleteTask = id => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}
</script>
