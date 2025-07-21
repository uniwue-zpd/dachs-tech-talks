<script setup>
const props = defineProps({
  colors: {
    type: Array,
    required: true,
    default: () => []
  },
  speed: {
    type: Number,
    default: 5
  },
  blur: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'medium', 'heavy'].includes(value)
  }
})

const containerRef = ref(null)
const dimensions = ref({ width: 0, height: 0 })

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const circleSize = computed(() =>
    Math.max(dimensions.value.width, dimensions.value.height)
)

const blurClass = computed(() => {
  switch (props.blur) {
    case 'light':
      return 'blur-2xl'
    case 'medium':
      return 'blur-3xl'
    case 'heavy':
      return 'blur-[100px]'
    default:
      return 'blur-2xl'
  }
})

const updateDimensions = () => {
  if (containerRef.value) {
    const { width, height } = containerRef.value.getBoundingClientRect()
    dimensions.value = { width, height }
  }
}

let timeoutId = null

const debouncedUpdateDimensions = () => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(updateDimensions, 250)
}

onMounted(() => {
  updateDimensions()
  window.addEventListener('resize', debouncedUpdateDimensions)
})

onUnmounted(() => {
  window.removeEventListener('resize', debouncedUpdateDimensions)
  if (timeoutId) clearTimeout(timeoutId)
})

const getAnimationProps = () => {
  return {
    '--animation-duration': `${props.speed}s`,
    '--tx-1': Math.random() - 0.5,
    '--ty-1': Math.random() - 0.5,
    '--tx-2': Math.random() - 0.5,
    '--ty-2': Math.random() - 0.5,
    '--tx-3': Math.random() - 0.5,
    '--ty-3': Math.random() - 0.5,
    '--tx-4': Math.random() - 0.5,
    '--ty-4': Math.random() - 0.5,
    top: `${Math.random() * 50}%`,
    left: `${Math.random() * 50}%`
  }
}
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden">
    <div :class="['absolute inset-0', blurClass]">
      <svg
          v-for="(color, index) in colors"
          :key="index"
          class="absolute animate-background-gradient"
          :width="circleSize * randomInt(0.5, 1.5)"
          :height="circleSize * randomInt(0.5, 1.5)"
          viewBox="0 0 100 100"
          :style="getAnimationProps()"
      >
        <circle cx="50" cy="50" r="50" :fill="color" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
@keyframes background-gradient {
  0%, 100% {
    transform: translate(calc(var(--tx-1) * 100px), calc(var(--ty-1) * 100px));
  }
  25% {
    transform: translate(calc(var(--tx-2) * 100px), calc(var(--ty-2) * 100px));
  }
  50% {
    transform: translate(calc(var(--tx-3) * 100px), calc(var(--ty-3) * 100px));
  }
  75% {
    transform: translate(calc(var(--tx-4) * 100px), calc(var(--ty-4) * 100px));
  }
}

.animate-background-gradient {
  animation: background-gradient var(--animation-duration, 5s) infinite ease-in-out;
}
</style>
