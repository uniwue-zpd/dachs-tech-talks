<template>
  <div
      class="relative py-20 md:px-0 px-2 overflow-hidden"
  >
    <div
        class="relative container md:max-w-6xl mx-auto bg-zinc-200 bg-[radial-gradient(ellipse_90%_90%_at_90%_-10%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-zinc-950 dark:bg-[radial-gradient(ellipse_90%_90%_at_90%_-10%,rgba(120,119,198,0.3),rgba(255,255,255,0))] overflow-hidden rounded-3xl pt-12 pb-30 lg:pt-36 px-10"
    >
      <div class="absolute inset-0 z-[5] bg-white/50 dark:bg-black/50 backdrop-blur-[1px] md:hidden" aria-hidden="true"></div>

      <div
          class="relative flex flex-col lg:w-2/3 justify-center mt-10 md:mt-0 z-10"
      >
        <h1
            class="text-5xl md:text-7xl font-bold leading-none md:leading-snug"
        >
          <LineShadowText
              class="italic"
              :shadow-color="shadowColor"
          >
            DACHS
          </LineShadowText> Tech Talks
        </h1>
        <p
            class="text-2xl text-secondary-content mt-1 leading-tight mb-8 z-10 max-w-[15rem] md:max-w-2xl lg:max-w-2xl"
        >
          Insights on <ClientOnly><FlipWords
            :words="categories"
            :duration="3000"
            class="text-2xl font-bold"
        /></ClientOnly><br />from and for the research group for <br /><a target="_blank" class="hover:underline" href="https://www.uni-wuerzburg.de/zpd/forschungsstelle-dachs/">Digital Applications in Humanities Studies</a>
        </p>
      </div>

      <div
          class="absolute bottom-[-30%] lg:bottom-[-25%] right-[-0%] overflow-hidden z-0"
      >
        <img v-if="colorMode.value === 'dark'" alt="" class="w-[350px] lg:w-[400px]" src="/landing-page/hero_dark.webp" >
        <img v-else alt="" class="w-[350px] lg:w-[400px]" src="/landing-page/hero_light.webp" >
      </div>
    </div>
  </div>
</template>

<script setup>
import { FlipWords } from '~/components/ui/flip-words/index.ts'
const colorMode = useColorMode()

const categories = [
  'niche libraries',
  'modern frameworks',
  'essential dev tools',
  'clever bug fixes',
  'the latest releases',
  'our own codebase',
  'design patterns',
]
const isDark = computed(() => useColorMode().value === 'dark')
const shadowColor = computed(() => (isDark.value ? 'white' : 'black'))
</script>
