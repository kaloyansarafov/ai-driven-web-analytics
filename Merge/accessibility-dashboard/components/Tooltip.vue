<template>
  <div class="relative inline-block">
    <!-- Trigger element -->
    <div
      ref="triggerRef"
      @mouseenter="show = true"
      @mouseleave="show = false"
      @focus="show = true"
      @blur="show = false"
      @keydown.escape="show = false"
      tabindex="0"
      role="button"
      :aria-describedby="tooltipId"
      class="inline-flex"
    >
      <slot name="trigger">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </slot>
    </div>

    <!-- Tooltip content -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="show"
        :id="tooltipId"
        ref="tooltipRef"
        role="tooltip"
        :class="[
          'absolute z-10 w-max max-w-xs px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-sm',
          positionClass,
        ]"
      >
        <!-- Arrow -->
        <div
          :class="[
            'absolute w-3 h-3 bg-gray-900 dark:bg-gray-700 transform rotate-45',
            arrowPositionClass,
          ]"
        ></div>

        <!-- Content -->
        <div class="relative z-10">
          <slot>Tooltip content goes here</slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { nanoid } from "nanoid/non-secure";

const props = defineProps({
  position: {
    type: String,
    default: "top",
    validator: (value) => ["top", "right", "bottom", "left"].includes(value),
  },
});

// State
const show = ref(false);
const tooltipId = computed(() => `tooltip-${nanoid(6)}`);
const triggerRef = ref(null);
const tooltipRef = ref(null);

// Position classes
const positionClass = computed(() => {
  switch (props.position) {
    case "top":
      return "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2";
    case "right":
      return "left-full top-1/2 transform translate-x-2 -translate-y-1/2";
    case "bottom":
      return "top-full left-1/2 transform -translate-x-1/2 translate-y-2";
    case "left":
      return "right-full top-1/2 transform -translate-x-2 -translate-y-1/2";
    default:
      return "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2";
  }
});

// Arrow position classes
const arrowPositionClass = computed(() => {
  switch (props.position) {
    case "top":
      return "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2";
    case "right":
      return "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2";
    case "bottom":
      return "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2";
    case "left":
      return "right-0 top-1/2 -translate-y-1/2 translate-x-1/2";
    default:
      return "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2";
  }
});

// Close tooltip when clicking outside
function handleClickOutside(event) {
  if (
    triggerRef.value &&
    !triggerRef.value.contains(event.target) &&
    tooltipRef.value &&
    !tooltipRef.value.contains(event.target)
  ) {
    show.value = false;
  }
}

// Event listeners
onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // Handle ESC key press globally
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && show.value) {
      show.value = false;
    }
  });
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
