<script setup lang="ts">
import type { PropType } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp } from 'lucide-vue-next'
import { useUpvotes } from '~/composables/useUpvotes'

interface Proposal {
  path: string
  title: string
  description: string
  tags: string[]
  votes: number
}

const props = defineProps({
  proposal: {
    type: Object as PropType<Proposal>,
    required: true,
  },
})

const { loggedIn, openInPopup } = useUserSession()
const { hasUpvoted, addUpvote } = useUpvotes()

const localVotes = ref(props.proposal.votes || 0)
const isVoting = ref(false)

const handleUpvote = async () => {
  if (isVoting.value || !loggedIn.value || hasUpvoted(props.proposal.path)) return

  isVoting.value = true
  try {
    const slug = props.proposal.path.split('/').pop()
    if (!slug) {
      throw new Error(`Could not derive slug from path: ${props.proposal.path}`)
    }

    const result = await $fetch(`/api/proposals/${slug}/vote`, {
      method: 'POST',
    })

    if (result && typeof result.votes === 'number') {
      localVotes.value = result.votes
      addUpvote(props.proposal.path)
    }
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
          <ThumbsUp class="h-4 w-4" :class="{'text-primary fill-primary': hasUpvoted(proposal.path) }" />
          <span class="font-semibold">{{ localVotes }}</span>
        </div>
        <Button
            v-if="!loggedIn"
            variant="outline"
            size="sm"
            @click="openInPopup('/auth/github')"
        >
          Login to Vote
        </Button>
        <Button
            v-else
            variant="ghost"
            size="sm"
            class="flex items-center gap-2"
            :disabled="isVoting || hasUpvoted(proposal.path)"
            @click="handleUpvote"
        >
          {{ hasUpvoted(proposal.path) ? 'Upvoted' : 'Upvote' }}
        </Button>
      </div>
    </div>
  </div>
</template>
