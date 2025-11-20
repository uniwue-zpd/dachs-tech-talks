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
import type { DropdownMenuItem } from '#ui/types'

const { loggedIn, user, clear } = useUserSession()

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

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('talks'))
const { data: files } = await useAsyncData('search', () => queryCollectionSearchSections('talks'))

const userName = computed(() => {
  return loggedIn ? user!.value.login : ''
})

const userItems = [
  [
    {
      label: userName,
      type: 'label'
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: clear
    }
  ]
] satisfies DropdownMenuItem[][]

const searchTerm = ref('')
</script>

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
          <UContentSearchButton />
          <AnimatedThemeToggle />
          <UButton
              v-if="!loggedIn"
              to="/api/auth/github"
              icon="i-simple-icons-github"
              label="Login with GitHub"
              color="neutral"
              size="xs"
              external
          />
          <div
              v-else
              class="flex flex-wrap -mx-2 sm:mx-0"
          >
            <UDropdownMenu
                v-if="user"
                :items="userItems"
            >
              <UButton
                  color="neutral"
                  variant="ghost"
                  trailing-icon="i-lucide-chevron-down"
              >
                <UAvatar
                    :src="`https://github.com/${user.login}.png`"
                    :alt="user.login"
                    size="2xs"
                />
              </UButton>
            </UDropdownMenu>
          </div>
          <Drawer v-model:open="isOpen" direction="right" should-scale-background set-background-color-on-scale>
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
                      <HyperText
                          text="DACHS Tech Talks"
                          class="hidden text-lg font-bold hover:cursor-pointer sm:block"
                          :duration="800"
                          :animate-on-load="true"
                      />
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
              <nav>
                <NuxtLink
                    v-for="item in menuItems"
                    :key="item.name"
                    :to="item.href"
                    class="flex items-center gap-x-2 p-4 mx-auto rounded-md text-6xl hover:bg-muted"
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

  <ClientOnly>
    <LazyUContentSearch
        v-model:search-term="searchTerm"
        shortcut="meta_k"
        :files="files"
        :navigation="navigation"
        :fuse="{ resultLimit: 42 }"
    />
  </ClientOnly>
</template>
