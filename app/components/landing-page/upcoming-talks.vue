<script setup>
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel'
import UpcomingTalkCard from "~/components/talk/upcoming-talk-card.vue";

const { data: upcomingTalks } = useAsyncData('upcoming-talk-list', () => {
  const today = new Date();
  return queryCollection('talks').where("date", ">", today.toISOString().slice(0, 10)).order('date', 'ASC').all()
})
</script>

<template>
  <div v-if="upcomingTalks && upcomingTalks.length > 0" class="py-12 px-6">
    <div class="container mx-auto md:max-w-[1200px]">
      <div class="mb-10">
        <h2 class="font-semibold text-4xl lg:text-6xl leading-snug">
          Upcoming Talks
        </h2>
        <p class="text-lg text-secondary-content mt-2 leading-tight">
          Don't miss out on our next sessions.
        </p>
      </div>

      <Carousel
          class="relative w-full"
          :opts="{
          align: 'start',
        }"
      >
        <CarouselContent>
          <CarouselItem
              v-for="talk in upcomingTalks"
              :key="talk.path"
              class="basis-full"
          >
            <div class="p-2 h-full">
              <UpcomingTalkCard :talk="talk" class="h-full" />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious class="hidden lg:flex" />
        <CarouselNext class="hidden lg:flex" />
      </Carousel>
    </div>
  </div>
</template>
