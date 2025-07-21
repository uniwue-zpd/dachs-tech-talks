<script setup>
import { getCategoryBySlug } from '@/lib/talks'
import { cn } from '@/lib/utils'

const props = defineProps({
  talk: {
    type: Object,
    required: true
  },
  gradientColors: {
    type: Array,
    default: () => ['#4c1d95', '#be185d', '#c2410c']
  },
  gradientSpeed: {
    type: Number,
    default: 7
  },
  gradientBlur: {
    type: String,
    default: 'large'
  }
})

const categoryDetails = computed(() => getCategoryBySlug(props.talk.category))

const fullDate = computed(() => {
  if (!props.talk.date) return null;
  const datePart = props.talk.date.split('T')[0];
  const timePart = props.talk.time || '10:30';
  return new Date(`${datePart}T${timePart}:00Z`);
});

const formattedDateShort = computed(() => {
  if (!fullDate.value) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(fullDate.value)
})

const formattedTime = computed(() => {
  if (!fullDate.value) return ''
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(fullDate.value) + ' UTC'
})
</script>

<template>
  <div class="w-full relative overflow-hidden rounded-2xl min-h-[240px] flex flex-col justify-between p-6 font-medium text-white">
    <div class="absolute inset-0 z-0 pointer-events-none">
      <AnimatedGradient
          :colors="gradientColors"
          :speed="gradientSpeed"
          :blur="gradientBlur"
      />
    </div>

    <div class="relative z-10 flex flex-col justify-between h-full">
      <div class="flex items-start justify-between gap-4 mb-6">
        <div class="flex-1">
          <NuxtLink v-if="categoryDetails" :to="`/talks?category=${categoryDetails.slug}`">
            <div :class="cn('inline-flex items-center px-3 py-1 rounded-full backdrop-blur-sm border text-xs font-semibold mb-3 transition-transform hover:scale-105', categoryDetails.gradientClass)">
              {{ categoryDetails.name }}
            </div>
          </NuxtLink>

          <NuxtLink :to="talk.path">
            <h2 class="text-2xl lg:text-3xl font-bold mb-2 leading-tight hover:underline">
              {{ talk.title }}
            </h2>
          </NuxtLink>

          <p class="text-white/90 text-base font-medium">
            by <NuxtLink :to="`/talks?speakers=${talk.speaker}`" class="hover:underline">{{ talk.speaker }}</NuxtLink>
          </p>
        </div>

        <div v-if="talk.image" class="flex-shrink-0">
          <img
              :src="talk.image"
              :alt="talk.title"
              class="w-20 h-20 rounded-xl object-cover border-2 border-white/30"
          />
        </div>
      </div>

      <div class="flex items-end justify-between gap-4">
        <div class="flex flex-wrap gap-2">
          <NuxtLink v-for="tag in talk.tags" :key="tag" :to="`/talks?tags=${tag.toLowerCase()}`">
            <span
                class="inline-flex items-center px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-white/90 transition-transform hover:scale-105"
            >
              #{{ tag }}
            </span>
          </NuxtLink>
        </div>

        <div class="flex flex-col items-end text-right flex-shrink-0">
          <div class="text-white/90 text-sm font-medium">
            {{ formattedDateShort }}
          </div>
          <div class="text-white/70 text-xs">
            {{ formattedTime }}
          </div>
          <a target="_blank" href="https://wueaddress.uni-wuerzburg.de/building/9023" class="text-white/70 text-xs hover:underline mt-1">
            {{ talk.location || '00.003' }}, ZPD
          </a>
        </div>
      </div>
    </div>

    <div class="absolute inset-0 bg-black/50 dark:bg-black/20 z-[1] pointer-events-none"></div>
  </div>
</template>
