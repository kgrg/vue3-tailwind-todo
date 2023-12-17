<template>
    <form @submit.prevent="performAction">
        <div class="grid gap-4 mb-4 sm:grid-cols-2">

            <TodoInput
                label="Name"
                id="name"
                v-model="todo.name"
                placeholder="Type task name"
                required />

            <div class="sm:col-span-2">
                <label for="description"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <textarea id="description" rows="4" v-model="todo.description"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Write task description here"></textarea>
            </div>
            <div>
                <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                <select v-model="todo.status"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>
        </div>
        <button type="submit"
            class="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
            {{ props.todoId ? 'Update' : 'Add' }} Task
        </button>
    </form>
</template>

<script setup>

import { ref, defineEmits, onMounted } from 'vue';
import { useTodoStore } from '@/stores/todo';
import TodoInput from '../components/Form/TodoInput.vue';

const emit = defineEmits(["close-modal"])

const props = defineProps({
    todoId: {
        type: Number,
        default: null
    }
})
const tasksStore = useTodoStore();
const todo = ref({
    name: '',
    description: '',
    status: 'todo',
});

const performAction = () => {
    if (props.todoId) {
        updateTask();
    } else {
        addTask();
    }
};

const addTask = () => {
    tasksStore.createTodo({ ...todo.value, id: Date.now() });
    resetTodo();
    emit('close-modal')
};

const updateTask = () => {
    tasksStore.updateTodo({ ...todo.value});
    resetTodo();
    emit('close-modal')
};

const resetTodo = () => {
    todo.value = {}
};

onMounted(() => {
    if (props.todoId) {
        const fetchedTodo = tasksStore.getTodoById(props.todoId);
        todo.value = { ...fetchedTodo };
    } 
});

</script>

<style lang="scss" scoped></style>