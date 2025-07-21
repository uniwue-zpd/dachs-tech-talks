<script setup>
import { ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel'

const { data: allTalks } = await useAsyncData('talk-list-past', () => {
  return queryCollection('talks').order('date', 'DESC').all()
})

const now = new Date()

const pastTalks = computed(() => {
  if (!allTalks.value) return []
  return allTalks.value.filter(talk => new Date(talk.date) < now)
})
</script>

<template>
  <div class="py-12 px-6">
    <div class="container mx-auto md:max-w-[1200px]">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <h1 class="font-semibold text-4xl lg:text-5xl max-w-2xl leading-snug">
            Explore Our
            <span class="text-primary">Talk Archive</span>
          </h1>
          <p class="text-lg text-muted-foreground max-w-2xl mt-2 leading-tight">
            Browse our archive of presentations and gain new perspectives from past sessions.
          </p>
        </div>
        <NuxtLink to="/talks">
          <Button variant="outline" class="w-full md:w-auto">
            View All Talks
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
        </NuxtLink>
      </div>

      <Carousel
          v-if="pastTalks && pastTalks.length"
          class="relative w-full"
          :opts="{
          align: 'start',
          loop: true,
        }"
      >
        <CarouselContent>
          <CarouselItem
              v-for="talk in pastTalks"
              :key="talk.id"
              class="md:basis-1/2 lg:basis-1/3"
          >
            <div class="p-1 h-full">
              <TalkCard :talk="talk" class="h-full" />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious class="hidden lg:flex" />
        <CarouselNext class="hidden lg:flex" />
      </Carousel>
      <div v-else class="text-center py-16 border rounded-lg bg-muted/50">
        <p class="text-muted-foreground">Our talk archive is currently empty.</p>
      </div>
    </div>
  </div>
</template>
