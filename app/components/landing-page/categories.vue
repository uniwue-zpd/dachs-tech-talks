<template>
  <div class="py-12 px-6">
    <div class="container mx-auto md:max-w-[1200px]">
      <h1 class="font-semibold text-4xl lg:text-6xl max-w-3xl leading-snug">
        Exploring Technology, Together at
        <span>DACHS Tech Talks</span>
      </h1>
      <p class="text-lg text-secondary-content max-w-2xl mt-2 leading-tight">
        Join our internal tech talks to share knowledge, discuss new trends, and learn from each other's experiences across a wide range of topics.
      </p>
      <div
          class="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-10"
      >
        <NuxtLink
            v-for="category in displayCategories"
            :key="category.slug"
            :to="`/talks?category=${category.slug}`"
            :class="[
            category.spanClass,
            'h-[280px] hover:text-white dark:hover:text-black hover:bg-primary dark:hover:bg-primary rounded-2xl p-6 dark:bg-zinc-800 bg-zinc-200 group transition-colors duration-200'
          ]"
        >
          <div class="h-full flex flex-col justify-between">
            <div class="flex">
              <p class="leading-tight pr-4" :class="{ 'max-w-md': category.spanClass.includes('lg:col-span-3') }">
                {{ category.description }}
              </p>
              <div class="group-hover:bg-white group-hover:dark:bg-black bg-primary w-fit p-3 h-fit rounded-full ml-auto transition-colors">
                <MoveUpRight class="text-white dark:text-black group-hover:text-primary group-hover:dark:text-white" />
              </div>
            </div>
            <h3 class="text-4xl font-[500]">{{ category.name }}</h3>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MoveUpRight } from 'lucide-vue-next'
import { CATEGORIES } from '@/lib/talks'

const categoryPageData = {
  'library-spotlight': { description: "Discover a cool, niche, or weirdly useful library that can change how you approach a problem.", spanClass: "lg:col-span-2" },
  'framework-spotlight': { description: "Go beyond the basics and explore what's new and powerful in frameworks like Vue, React, Nuxt, Spring, and more.", spanClass: "lg:col-span-3" },
  'dev-tooling': { description: "Boost your productivity with clever tips and tricks for Git, Docker, IDE plugins, and other essential dev tools.", spanClass: "lg:col-span-3" },
  'recent-bugs-fixes': { description: "Listen to a developer's war story—a fascinating tale of debugging a tricky issue and the clever fix that saved the day.", spanClass: "lg:col-span-2" },
  'release-radar': { description: "Stay up-to-date with the latest features and changes in Node.js, TypeScript, Python, and other core technologies.", spanClass: "lg:col-span-2" },
  'behind-the-scenes': { description: "Get a guided tour of a specific piece of your team's codebase and understand how it works under the hood.", spanClass: "lg:col-span-3" },
  'architecture-bits': { description: "A mini-talk on design patterns, architectural trade-offs, or the choices made in scaling a system.", spanClass: "lg:col-span-3" },
  'misc': { description: "A catch-all for talks that don't fit neatly into other categories.", spanClass: "lg:col-span-2" }
}

const displayCategories = computed(() => {
  return Object.values(CATEGORIES).map(category => ({
    ...category,
    ...(categoryPageData[category.slug] || {})
  }))
})
</script>
