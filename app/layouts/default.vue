<template>
  <Transition name="fade" mode="out-in">
    <div v-if="!isAppReady" key="loader">
      <LayoutSplashscreen />
    </div>

    <div v-else key="content" class="antialiased bg-zinc-100 dark:bg-zinc-900">
      <div class="px-4">
        <div class="container-fluid md:max-w-6xl mx-auto min-h-screen">
          <LayoutNavbar />
          <div class="pt-12" vaul-drawer-wrapper>
            <slot />
          </div>
        </div>
        <LayoutFooter />
        <ScrollToTop />
      </div>
    </div>
  </Transition>
</template>

<script setup>
const isAppReady = useState('isAppReady', () => false)

onMounted(() => {
  isAppReady.value = true
})

useHead({
  title: 'DACHS Tech Talks',
  meta: [
    { name: 'description', content: 'Website for DACHS Tech Talks' }
  ],
  htmlAttrs: {
    lang: 'en'
  },
  bodyAttrs: {
    class: 'outfit'
  }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
