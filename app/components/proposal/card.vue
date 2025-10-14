<script setup lang="ts">
import type { PropType } from 'vue'
import { ThumbsUp } from 'lucide-vue-next'

interface Proposal {
  path: string
  title: string
  description: string
  tags: string[]
}

const props = defineProps({
  proposal: {
    type: Object as PropType<Proposal>,
    required: true,
  },
})

const { loggedIn } = useUserSession()

const slug = computed(() => props.proposal.path.split('/').pop() || '')

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
  <div class="h-full flex flex-col p-6 rounded-lg border-2 border-dashed bg-card text-card-foreground shadow-sm transition-all duration-200">
    <NuxtLink :to="proposal.path" class="block group flex-grow">
      <h2 class="text-xl font-semibold group-hover:text-primary transition-colors">
        {{ proposal.title }}
      </h2>
      <p class="mt-3 text-muted-foreground line-clamp-3 text-sm">
        {{ proposal.description }}
      </p>
    </NuxtLink>

    <div class="mt-4 pt-4 border-t border-dashed flex items-end justify-between">
      <div v-if="proposal.tags && proposal.tags.length > 0" class="flex flex-wrap gap-2">
        <Badge v-for="tag in proposal.tags" :key="tag" variant="secondary" class="font-normal">
          #{{ tag }}
        </Badge>
      </div>
      <div v-else class="flex-grow"/>

      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="sm" :disabled="isVoting" @click="handleUpvote">
                  <ThumbsUp
                      class="h-4 w-4"
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
  </div>
</template>