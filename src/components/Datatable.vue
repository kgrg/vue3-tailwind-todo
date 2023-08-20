<template>
  <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
    <thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th v-for="column in columns" :key="column.key" class="px-4 py-4">
          {{ column.label }}
        </th>
        <th class="px-4 py-4">action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.id" class="border-b dark:border-gray-700">
        <td v-for="column in columns" :key="column.key" class="px-4 py-3">
          {{ row[column.key] }}
        </td>
        <td class="flex items-center px-4 py-3">
          <button @click="editTodo(row.id)"
            class="flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mr-2">Edit</button>
          <button @click="deleteTodo(row.id)"
            class="flex items-center justify-center rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { defineProps } from 'vue'

const emit = defineEmits(['edit', 'delete'])

const props = defineProps({
  rows: Array,
  columns: Array
})

const editTodo = todoId => {
  emit('edit', todoId);
};

const deleteTodo = todoId => {
  emit('delete', todoId);
};

</script>
