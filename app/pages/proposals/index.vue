<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Check, PlusCircle, Mic } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const router = useRouter()

const { data: allProposals } = await useAsyncData('proposal-list', () => queryCollection('proposals').all())

// Fetch all proposal stats in a single call (you'll need to create this endpoint)
const { data: allStats } = await useFetch('/api/proposals/all-stats', {
  key: 'all-proposal-stats'
})

const getTagsFromUrl = () => route.query.tags ? route.query.tags.toString().split(',').filter(Boolean) : []
const getSortFromUrl = () => route.query.sort === 'top' ? 'top' : 'newest'

const selectedTags = ref<string[]>(getTagsFromUrl())
const searchTerm = ref('')
const sortOrder = ref<'newest' | 'top'>(getSortFromUrl())

const proposalsWithVotes = computed(() => {
  if (!allProposals.value) return []
  return allProposals.value.map(proposal => {
    const slug = proposal.path.split('/').pop() || ''
    const stats = allStats.value?.[slug]
    return {
      ...proposal,
      votes: stats?.count || 0,
    }
  })
})

const uniqueTags = computed(() => {
  if (!proposalsWithVotes.value) return new Map()
  const tagDetailsMap = new Map()
  proposalsWithVotes.value.forEach(p => {
    if (p.tags) p.tags.forEach(tag => {
      const lower = tag.toLowerCase()
      const current = tagDetailsMap.get(lower) || { display: tag, count: 0 }
      tagDetailsMap.set(lower, { ...current, count: current.count + 1 })
    })
  })
  return new Map([...tagDetailsMap.entries()].sort((a, b) => a[0].localeCompare(b[0])))
})

const filteredAndSortedProposals = computed(() => {
  if (!proposalsWithVotes.value) return []

  let result = proposalsWithVotes.value.filter(p => {
    const searchLower = searchTerm.value.toLowerCase()
    const searchMatch = !searchLower || p.title.toLowerCase().includes(searchLower) || (p.description && p.description.toLowerCase().includes(searchLower))
    const tagMatch = selectedTags.value.length === 0 || (p.tags && p.tags.some(t => selectedTags.value.includes(t.toLowerCase())))
    return searchMatch && tagMatch
  })

  if (sortOrder.value === 'top') {
    result.sort((a, b) => b.votes - a.votes)
  }

  return result
})

watch([selectedTags, sortOrder], ([tags, sort]) => {
  const query: Record<string, string | undefined> = {
    tags: tags.length > 0 ? tags.join(',') : undefined,
    sort: sort === 'top' ? 'top' : undefined,
  }
  Object.keys(query).forEach(key => query[key] === undefined && delete query[key])
  router.push({ query })
}, { deep: true })

const toggleSelection = (arr, item) => {
  const index = arr.indexOf(item)
  if (index > -1) arr.splice(index, 1)
  else arr.push(item)
}
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold tracking-tight lg:text-5xl">Talk Proposals & Ideas</h1>
      <p class="mt-4 text-lg text-muted-foreground">Browse ideas submitted by the community. Vote on your favorites or pick one up to develop into a full talk!</p>
    </div>

    <div class="flex flex-col md:flex-row items-center gap-4 mb-8 max-w-4xl mx-auto">
      <Input v-model="searchTerm" type="text" placeholder="Search proposals..." class="flex-grow w-full" />
      <div class="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        <Select v-model="sortOrder">
          <SelectTrigger class="w-full md:w-[150px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="top">Most Upvoted</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline" size="sm" class="h-9 border-dashed w-full md:w-auto">
              <PlusCircle class="mr-2 h-4 w-4" />Tags
              <template v-if="selectedTags.length > 0">
                <Separator orientation="vertical" class="mx-2 h-4" />
                <Badge variant="secondary" class="rounded-sm px-1 font-normal">{{ selectedTags.length }}</Badge>
              </template>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[250px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Filter tags..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                      v-for="[lowerTag, details] in uniqueTags"
                      :key="lowerTag"
                      :value="lowerTag"
                      @select="() => toggleSelection(selectedTags, lowerTag)"
                  >
                    <div :class="cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', selectedTags.includes(lowerTag) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')">
                      <Check class="h-4 w-4" />
                    </div>
                    <span class="capitalize">{{ details.display }}</span>
                    <span class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">{{ details.count }}</span>
                  </CommandItem>
                </CommandGroup>
                <template v-if="selectedTags.length > 0">
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem class="justify-center text-center" @select="selectedTags = []">
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </template>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <div v-if="filteredAndSortedProposals.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ProposalCard v-for="proposal in filteredAndSortedProposals" :key="proposal.path" :proposal="proposal" />
    </div>
    <div v-else class="text-center py-16 px-6 border-2 border-dashed rounded-lg">
      <h3 class="text-xl font-semibold">No Proposals Found</h3>
      <p class="text-muted-foreground mt-2 max-w-md mx-auto">It looks quiet here. Why not be the first to suggest a topic for a future tech talk?</p>
      <div class="mt-6">
        <Button size="lg" as-child>
          <a href="https://github.com/your-org/your-repo/issues/new/choose" target="_blank" rel="noopener noreferrer">
            <Mic class="mr-2 h-5 w-5" />
            Propose a Topic
          </a>
        </Button>
      </div>
    </div>
  </div>
</template>