<template>
  <header
      class="fixed top-0 left-0 inset-x-0 mx-auto z-50 transition-all duration-300 rounded-full"
      :class="[y > 0 ? 'bg-background/80 backdrop-blur-sm w-[95%] md:w-[80%] md:max-w-5xl md:px-6 mt-3 md:mt-2' : 'bg-transparent w-[97%] md:max-w-6xl mt-2']"
  >
    <div class="py-4 md:px-0 px-6">
      <div class="mx-auto flex justify-between items-center">
        <NuxtLink class="flex items-center gap-x-2 pl-4 lg:pl-0" to="/">
          <LayoutLogo height="48" width="48" />
          <HyperText
              text="DACHS Tech Talks"
              class="hidden text-lg font-bold hover:cursor-pointer sm:block"
              :duration="800"
              :animate-on-load="true"
          />
        </NuxtLink>

        <div class="flex items-center gap-x-2 px-2">
          <AnimatedThemeToggle />
          <Drawer v-model:open="isOpen">
            <DrawerTrigger as-child>
              <Button variant="ghost" size="icon">
                <Menu class="h-6 w-6" />
                <span class="sr-only">Toggle Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  <div class="flex justify-between items-center">
                    <NuxtLink class="flex items-center" to="/" @click="isOpen = false">
                      <LayoutLogo height="48" width="48" />
                      <span class="text-lg font-bold">DACHS Tech Talks</span>
                    </NuxtLink>
                    <DrawerClose as-child>
                      <Button variant="ghost" size="icon">
                        <CircleX class="h-6 w-6" />
                        <span class="sr-only">Close Menu</span>
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerTitle>
              </DrawerHeader>
              <nav class="p-4">
                <NuxtLink
                    v-for="item in menuItems"
                    :key="item.name"
                    :to="item.href"
                    class="flex items-center gap-x-2 p-4 mx-auto rounded-md text-2xl hover:bg-muted"
                    @click="isOpen = false"
                >
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Menu, CircleX } from 'lucide-vue-next'
import { HyperText } from '~/components/ui/hyper-text'
import AnimatedThemeToggle from '~/components/animated-theme-toggle/AnimatedThemeToggle.vue'

const { y } = useWindowScroll()

const isOpen = ref(false)

interface MenuItem {
  name: string
  href: string
}

const menuItems: MenuItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Talks', href: '/talks' },
  { name: 'Proposals', href: '/proposals' },
  { name: 'About', href: '/about' },
]
</script>
