<template>
  <Transition>
    <div
      id="createProductModal"
      tabindex="-1"
      aria-hidden="true"
      v-if="modalActive"
      class="max-h-fulloverflow-y-auto fixed fixed left-0 left-0 right-0 right-0 top-0 top-0 z-50 z-50 flex h-[calc(100%-1rem)] h-[calc(100%-1rem)] max-h-full w-full w-full items-center items-center justify-center justify-center overflow-y-auto overflow-x-hidden overflow-x-hidden md:inset-0 md:inset-0"
    >
      <div class="relative max-h-full w-full max-w-2xl p-4">
        <!-- Modal content -->
        <div
          class="relative rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-5"
        >
          <!-- Modal header -->
          <div
            class="mb-4 flex items-center justify-between rounded-t border-b pb-4 dark:border-gray-600 sm:mb-5"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Add Task
            </h3>
            <button
              type="button"
              class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-target="createProductModal"
              data-modal-toggle="createProductModal"
              @click="$emit('close-modal')"
            >
              <svg
                aria-hidden="true"
                class="h-5 w-5"
                fill="currentColor"
                viewbox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <slot />
        </div>
      </div>
    </div>
  </Transition>
  <div
    v-if="modalActive"
    modal-backdrop=""
    class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
  ></div>
</template>

<script setup>
defineEmits(['close-modal'])
defineProps({
  modalActive: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped></style>
