<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Check, PlusCircle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { getCategoryNames, getCategoryBySlug, getCategoryByName  } from '@/lib/talks'
import type {Talk} from '@/lib/talks';

const categories = getCategoryNames()
const timeOptions = { all: 'All Time', past: 'Past Talks', future: 'Future Talks' }

const route = useRoute()
const router = useRouter()

const { data: allTalks } = await useAsyncData<Talk[]>(route.path, () => {
  return queryCollection('talks').order("date", "DESC").all()
})

const getFromUrl = (param: string) => route.query[param] ? route.query[param]!.toString().split(',').filter(Boolean) : []
const getTimeFromUrl = () => {
  const timeParam = route.query.time?.toString()
  return timeParam && Object.keys(timeOptions).includes(timeParam) ? timeParam : 'all'
}
const getCategoryFromUrl = () => {
  const catSlugFromUrl = route.query.category?.toString()
  const foundCategory = getCategoryBySlug(catSlugFromUrl)
  return foundCategory ? foundCategory.name : 'All Talks'
}

const selectedTime = ref<string>(getTimeFromUrl())
const selectedCategory = ref<string>(getCategoryFromUrl())
const selectedTags = ref<string[]>(getFromUrl('tags'))
const selectedSpeakers = ref<string[]>(getFromUrl('speakers'))
const searchTerm = ref('')

const uniqueSpeakers = computed(() => {
  if (!allTalks.value) return new Map<string, number>()
  const speakerMap = new Map<string, number>()
  allTalks.value.forEach(talk => speakerMap.set(talk.speaker, (speakerMap.get(talk.speaker) || 0) + 1))
  return new Map([...speakerMap.entries()].sort())
})

const uniqueTags = computed(() => {
  if (!allTalks.value) return new Map<string, { display: string, count: number }>()
  const tagDetailsMap = new Map<string, { display: string, count: number }>()
  allTalks.value.forEach(talk => {
    talk.tags.forEach(originalTag => {
      const lowerTag = originalTag.toLowerCase()
      if (tagDetailsMap.has(lowerTag)) {
        tagDetailsMap.get(lowerTag)!.count++
      } else {
        tagDetailsMap.set(lowerTag, { display: originalTag, count: 1 })
      }
    })
  })
  return new Map([...tagDetailsMap.entries()].sort((a, b) => a[0].localeCompare(b[0])))
})

const filteredTalks = computed(() => {
  if (!allTalks.value) return []
  const cutoffDate = new Date();
  cutoffDate.setHours(10, 0, 0, 0);

  return allTalks.value.filter(talk => {
    const talkDate = new Date(talk.date)
    const timeMatch = selectedTime.value === 'all' || (selectedTime.value === 'past' && talkDate < cutoffDate) || (selectedTime.value === 'future' && talkDate >= cutoffDate)

    const categoryDetails = getCategoryBySlug(talk.category)
    const categoryMatch = selectedCategory.value === 'All Talks' || (categoryDetails && categoryDetails.name === selectedCategory.value)

    const searchLower = searchTerm.value.toLowerCase()
    const searchMatch = !searchLower || talk.title.toLowerCase().includes(searchLower) || talk.description.toLowerCase().includes(searchLower)

    const tagMatch = selectedTags.value.length === 0 || selectedTags.value.every(tag => talk.tags.some(t => t.toLowerCase() === tag))

    const speakerMatch = selectedSpeakers.value.length === 0 || selectedSpeakers.value.includes(talk.speaker)

    return timeMatch && categoryMatch && searchMatch && tagMatch && speakerMatch
  })
})

watch([selectedTime, selectedCategory, selectedTags, selectedSpeakers], ([time, categoryName, tags, speakers]) => {
  const categoryDetails = getCategoryByName(categoryName)
  const query: Record<string, string | undefined> = {
    time: time === 'all' ? undefined : time,
    category: categoryName === 'All Talks' ? undefined : categoryDetails?.slug,
    tags: tags.length > 0 ? tags.join(',') : undefined,
    speakers: speakers.length > 0 ? speakers.join(',') : undefined,
  }
  Object.keys(query).forEach(key => query[key] === undefined && delete query[key])
  router.push({ query })
}, { deep: true })

function toggleSelection(array: string[], item: string) {
  const index = array.indexOf(item);
  if (index > -1) array.splice(index, 1); else array.push(item);
}
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold tracking-tight lg:text-5xl">Talks</h1>
      <p class="mt-4 text-lg text-muted-foreground">Browse our collection of talks. Use the filters to find exactly what you're looking for.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <aside class="lg:col-span-1">
        <nav class="flex flex-row lg:flex-col gap-2 sticky top-24 overflow-x-auto pb-2 lg:pb-0">
          <Button v-for="category in categories" :key="category" :variant="selectedCategory === category ? 'default' : 'ghost'" class="justify-start shrink-0" @click="selectedCategory = category">
            {{ category }}
          </Button>
        </nav>
      </aside>

      <main class="lg:col-span-4">
        <div class="flex flex-col md:flex-row items-center gap-4 mb-6">
          <Input v-model="searchTerm" type="text" placeholder="Search talks..." class="flex-grow w-full" />
          <div class="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Select v-model="selectedTime">
              <SelectTrigger class="w-full md:w-[150px]"><SelectValue placeholder="Select time" /></SelectTrigger>
              <SelectContent><SelectGroup>
                <SelectItem v-for="(label, value) in timeOptions" :key="value" :value="value">{{ label }}</SelectItem>
              </SelectGroup></SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger as-child><Button variant="outline" size="sm" class="h-9 border-dashed w-full md:w-auto">
                <PlusCircle class="mr-2 h-4 w-4" />Speakers
                <template v-if="selectedSpeakers.length > 0"><Separator orientation="vertical" class="mx-2 h-4" />
                  <Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">{{ selectedSpeakers.length }}</Badge>
                  <div class="hidden space-x-1 lg:flex">
                    <Badge v-for="speaker in selectedSpeakers.slice(0, 2)" :key="speaker" variant="secondary" class="rounded-sm px-1 font-normal">{{ speaker }}</Badge>
                    <Badge v-if="selectedSpeakers.length > 2" variant="secondary" class="rounded-sm px-1 font-normal">+{{ selectedSpeakers.length - 2 }}</Badge>
                  </div>
                </template>
              </Button></PopoverTrigger>
              <PopoverContent class="w-[250px] p-0" align="end"><Command>
                <CommandInput placeholder="Filter speakers..." /><CommandList><CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem v-for="[speaker, count] in uniqueSpeakers" :key="speaker" :value="speaker" @select="() => toggleSelection(selectedSpeakers, speaker)">
                    <div :class="cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', selectedSpeakers.includes(speaker) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')"><Check class="h-4 w-4" /></div>
                    <span>{{ speaker }}</span><span class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">{{ count }}</span>
                  </CommandItem>
                </CommandGroup>
                <template v-if="selectedSpeakers.length > 0"><CommandSeparator /><CommandGroup>
                  <CommandItem class="justify-center text-center" @select="selectedSpeakers = []">Clear filters</CommandItem>
                </CommandGroup></template>
              </CommandList>
              </Command></PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger as-child><Button variant="outline" size="sm" class="h-9 border-dashed w-full md:w-auto">
                <PlusCircle class="mr-2 h-4 w-4" />Tags
                <template v-if="selectedTags.length > 0"><Separator orientation="vertical" class="mx-2 h-4" />
                  <Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">{{ selectedTags.length }}</Badge>
                  <div class="hidden space-x-1 lg:flex">
                    <Badge v-for="tag in selectedTags.slice(0, 2)" :key="tag" variant="secondary" class="rounded-sm px-1 font-normal capitalize">{{ tag }}</Badge>
                    <Badge v-if="selectedTags.length > 2" variant="secondary" class="rounded-sm px-1 font-normal">+{{ selectedTags.length - 2 }}</Badge>
                  </div>
                </template>
              </Button></PopoverTrigger>
              <PopoverContent class="w-[250px] p-0" align="end"><Command>
                <CommandInput placeholder="Filter tags..." /><CommandList><CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem v-for="[lowerTag, details] in uniqueTags" :key="lowerTag" :value="lowerTag" @select="() => toggleSelection(selectedTags, lowerTag)">
                    <div :class="cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', selectedTags.includes(lowerTag) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')"><Check class="h-4 w-4" /></div>
                    <span class="capitalize">{{ details.display }}</span><span class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">{{ details.count }}</span>
                  </CommandItem>
                </CommandGroup>
                <template v-if="selectedTags.length > 0"><CommandSeparator /><CommandGroup>
                  <CommandItem class="justify-center text-center" @select="selectedTags = []">Clear filters</CommandItem>
                </CommandGroup></template>
              </CommandList>
              </Command></PopoverContent>
            </Popover>
          </div>
        </div>

        <div v-if="filteredTalks && filteredTalks.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <TalkCard v-for="talk in filteredTalks" :key="talk.id" :talk="talk" />
        </div>
        <div v-else class="flex items-center justify-center h-64 border rounded-lg bg-muted/20">
          <p class="text-muted-foreground">No talks found. Try adjusting your filters.</p>
        </div>
      </main>
    </div>
  </div>
</template>
