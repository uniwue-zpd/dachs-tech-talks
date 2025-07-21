<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import { type Proposal } from '@/lib/proposals'

const props = defineProps({
  data: {
    type: Object as () => Proposal,
    required: true,
  },
})

</script>

<template>
  <section v-if="data" class="py-16 md:py-24 text-wrap break-words">
    <div class="container">
      <div class="max-w-3xl mx-auto mb-8">
        <NuxtLink to="/proposals">
          <Button variant="ghost" size="sm">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Back to All Proposals
          </Button>
        </NuxtLink>
      </div>

      <div class="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">

        <h1 class="max-w-3xl text-pretty text-4xl font-semibold md:text-6xl">
          {{ data.title }}
        </h1>

        <div v-if="data.tags && data.tags.length" class="mt-2 flex flex-wrap justify-center gap-2">
          <NuxtLink v-for="tag in data.tags" :key="tag" :to="`/proposals?tags=${tag.toLowerCase()}`">
            <Badge variant="primary" class="transition-transform hover:scale-105">
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
