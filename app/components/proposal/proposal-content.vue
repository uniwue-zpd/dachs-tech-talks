<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ThumbsUp } from 'lucide-vue-next'
import type { Proposal } from '@/lib/proposals'
import { useUpvotes } from '~/composables/useUpvotes'
import { ref } from 'vue'

const props = defineProps({
  data: {
    type: Object as () => Proposal,
    required: true,
  },
})

const { loggedIn, openInPopup } = useUserSession()
const { hasUpvoted, addUpvote } = useUpvotes()
const { data: votes } = await useFetch('/api/proposals/votes', { key: 'proposal-votes' })

const slug = props.data.path.split('/').pop() || ''
const localVotes = ref(votes.value?.[slug] || 0)
const isVoting = ref(false)

const handleUpvote = async () => {
  if (isVoting.value || !loggedIn.value || hasUpvoted(props.data.path)) return

  isVoting.value = true
  try {
    const result = await $fetch(`/api/proposals/${slug}/vote`, {
      method: 'POST',
    })

    if (result && typeof result.votes === 'number') {
      localVotes.value = result.votes
      addUpvote(props.data.path)
    }
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
          <ThumbsUp class="h-6 w-6" :class="{'text-primary fill-primary': hasUpvoted(data.path) }" />
          <span class="font-semibold">{{ localVotes }}</span>
        </div>
        <Button
            v-if="!loggedIn"
            variant="outline"
            @click="openInPopup('/auth/github')"
        >
          Login with GitHub to Vote
        </Button>
        <Button
            v-else
            :disabled="isVoting || hasUpvoted(data.path)"
            @click="handleUpvote"
        >
          <ThumbsUp class="mr-2 h-4 w-4" />
          {{ hasUpvoted(data.path) ? 'Upvoted' : 'Upvote' }}
        </Button>
      </div>
    </div>
  </section>
</template>
