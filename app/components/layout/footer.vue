<script setup lang="ts">
import { Separator } from '~/components/ui/separator'
import {HyperText} from "~/components/ui/hyper-text";

const footerLinks = [
  {
    title: 'Talks',
    href: '/talks',
  },
  {
    title: 'Proposals',
    href: '/proposals',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Privacy Policy',
    href: '/privacy',
  },
  {
    title: 'Imprint',
    href: '/imprint',
  },
]
</script>

<template>
   <footer>
      <div class="max-w-screen-xl mx-auto">
        <div class="py-12 w-full flex flex-col md:flex-row justify-between items-end">
            <NuxtLink class="flex items-center" to="/">
              <HyperText
                  text="DACHS Tech Talks"
                  class="text-lg font-bold hover:cursor-pointer"
                  :duration="800"
                  :animate-on-load="true"
              />
            </NuxtLink>

          <ul class="flex items-center gap-4 flex-wrap">
            <li v-for="link in footerLinks" :key="link.title">
              <NuxtLink
                  :to="link.href"
                  class="text-muted-foreground hover:text-foreground font-medium"
              >
                {{ link.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <Separator />
        <div class="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          <span class="text-muted-foreground">
            &copy; {{ new Date().getFullYear() }}
            <NuxtLink to="/imprint" target="_blank">
              Digital Applications in Humanities Studies
            </NuxtLink>
          </span>

          <div class="flex items-center gap-5 text-muted-foreground">
            <NuxtLink to="#" target="_blank">
              <Icon name="carbon:logo-mastodon" width="5" height="5" />
            </NuxtLink>
            <NuxtLink to="https://github.com/uniwue-zpd" target="_blank">
              <Icon name="carbon:logo-github" width="5" height="5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
</template>
