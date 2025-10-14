<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ThumbsUp } from 'lucide-vue-next'
import type { Proposal } from '@/lib/proposals'

const props = defineProps({
  data: {
    type: Object as () => Proposal,
    required: true,
  },
})

const { loggedIn } = useUserSession()

const slug = computed(() => props.data.path.split('/').pop() || '')

const { data: stats, refresh: refreshStats } = await useFetch(`/api/proposals/${slug.value}/stats`, {
  key: `stats-${slug.value}`,
})

const { data: voters, refresh: refreshVoters } = await useFetch(`/api/proposals/${slug.value}/voters`, {
  key: `voters-${slug.value}`,
})

const isVoting = ref(false)

const handleUpvote = async () => {
  if (isVoting.value) return

  if (!loggedIn.value) {
    navigateTo('/api/auth/github', { external: true })
    return
  }

  isVoting.value = true
  try {
    await $fetch(`/api/proposals/${slug.value}/upvote`, {
      method: 'POST',
    })

    await refreshStats()
    await refreshVoters()
  } catch (error) {
    console.error('Failed to upvote:', error)
  } finally {
    isVoting.value = false
  }
}
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
            <Badge variant="default" class="transition-transform hover:scale-105">
              #{{ tag }}
            </Badge>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="container mt-8">
      <ContentRenderer
          :value="data.body"
          class="prose dark:prose-invert mx-auto max-w-3xl"
      />
    </div>

    <div class="container max-w-3xl mx-auto mt-12 text-center">
      <div class="flex items-center justify-center gap-4">
        <div class="flex items-center gap-2 text-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                    variant="ghost"
                    @click="handleUpvote">
                  <ThumbsUp
                      class="h-6 w-6"
                      :class="{'text-primary fill-primary': stats?.hasUpvoted }"
                  />
                  <span class="font-semibold">{{ stats?.count || 0 }}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div v-if="voters?.length" class="flex flex-col space-y-2 p-2">
                  <div v-for="voter in voters" :key="voter" class="flex flex-row space-x-2 items-center">
                    <Avatar>
                      <AvatarImage :src="`https://github.com/${voter}.png`" :alt="`{voter}`" />
                    </Avatar>
                    <p>{{ voter }}</p>
                  </div>
                </div>
                <div v-else>
                  <p>No votes yet.</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  </section>
</template>