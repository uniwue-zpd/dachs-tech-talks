<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { getCategoryBySlug  } from '@/lib/talks'
import type {Talk} from '@/lib/talks';

const props = defineProps({
  data: {
    type: Object as () => Talk,
    required: true,
  },
})

const categoryDetails = computed(() => {
  return getCategoryBySlug(props.data?.category)
})

const formattedDate = useDateFormat(() => props.data?.date, 'MMMM D, YYYY')

const authorInitial = computed(() => {
  return props.data?.speaker?.charAt(0).toUpperCase() || 'A'
})
</script>

<template>
  <section v-if="data" class="py-16 md:py-24 text-wrap break-words">
    <div class="container">
      <div class="max-w-3xl mx-auto mb-8">
        <NuxtLink to="/talks">
          <Button variant="ghost" size="sm">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Back to All Talks
          </Button>
        </NuxtLink>
      </div>

      <div class="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <NuxtLink v-if="categoryDetails" :to="`/talks?category=${categoryDetails.slug}`">
          <Badge :class="cn('text-sm font-semibold transition-transform hover:scale-105', categoryDetails.class)">
            {{ categoryDetails.name }}
          </Badge>
        </NuxtLink>

        <h1 class="max-w-3xl text-pretty text-4xl font-semibold md:text-6xl">
          {{ data.title }}
        </h1>

        <h3 class="text-muted-foreground max-w-3xl text-lg md:text-xl">
          {{ data.description }}
        </h3>

        <div class="flex items-center gap-3 text-sm md:text-base">
          <Avatar class="h-8 w-8 border">
            <AvatarImage :src="data.authorImage" />
            <AvatarFallback>{{ authorInitial }}</AvatarFallback>
          </Avatar>
          <span>
            <NuxtLink :to="`/talks?speakers=${data.speaker}`" class="font-semibold hover:underline">
              {{ data.speaker }}
            </NuxtLink>
            <span v-if="data.date" class="ml-1 text-muted-foreground">
              on {{ formattedDate }}
            </span>
          </span>
        </div>

        <div v-if="data.tags && data.tags.length" class="mt-2 flex flex-wrap justify-center gap-2">
          <NuxtLink v-for="tag in data.tags" :key="tag" :to="`/talks?tags=${tag.toLowerCase()}`">
            <Badge variant="default" class="transition-transform hover:scale-105">
              #{{ tag }}
            </Badge>
          </NuxtLink>
        </div>

        <img
            v-if="data.image"
            :src="data.image"
            :alt="data.title"
            class="mb-8 mt-4 aspect-video w-full rounded-lg border object-cover"
        >
      </div>
    </div>

    <div class="container mt-8">
      <ContentRenderer
          :value="data.body"
          class="prose dark:prose-invert mx-auto max-w-3xl"
      />
    </div>
  </section>
</template>
