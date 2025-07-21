<template>
  <Transition name="fade">
    <Button
        v-if="isVisible"
        variant="outline"
        size="icon"
        class="fixed bottom-8 right-8 z-50 h-10 w-10 rounded-full shadow-lg bg-zinc-50 dark:bg-zinc-900"
        aria-label="Scroll to top"
        @click="scrollToTop"
    >
      <ArrowUp class="h-5 w-5" />
    </Button>
  </Transition>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { ArrowUp } from 'lucide-vue-next'

const isVisible = ref(false)

const scrollThreshold = 200

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const handleScroll = () => {
  isVisible.value = window.scrollY > scrollThreshold;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
