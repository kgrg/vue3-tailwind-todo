<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ label }}
        </label>
        <input :id="id" :value="modelValue" @input="updateValue"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            :placeholder="placeholder" :required="required" />
    </div>
</template>
  
<script setup>

defineProps({
    label: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
    },
    required: {
        type: Boolean,
    },
    modelValue: {
       type: String,
       default: '',
   },
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
    emit('update:modelValue', event.target.value);
};

</script>