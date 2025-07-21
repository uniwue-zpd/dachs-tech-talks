<script setup lang="ts">
import type { PropType } from 'vue';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getCategoryBySlug  } from '@/lib/talks';
import type {Talk} from '@/lib/talks';

const props = defineProps({
  talk: {
    type: Object as PropType<Talk>,
    required: true,
  },
});

const categoryDetails = getCategoryBySlug(props.talk.category);

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<template>
  <NuxtLink :to="talk.path" class="block group h-full">
    <article
        class="h-full flex flex-col p-6 rounded-2xl dark:bg-zinc-800 bg-zinc-200 hover:text-white dark:hover:text-black hover:bg-primary dark:hover:bg-primary transition-colors duration-200"
    >
      <div class="mb-3">
        <Badge v-if="categoryDetails" :class="cn('transition-colors', categoryDetails.class)">
          {{ categoryDetails.name }}
        </Badge>
      </div>

      <div class="flex-grow">
        <h2 class="text-xl font-semibold group-hover:text-white dark:group-hover:text-black transition-colors">
          {{ talk.title }}
        </h2>
        <p class="mt-3 text-zinc-600 dark:text-zinc-400 group-hover:text-white/80 dark:group-hover:text-black/80 transition-colors text-sm line-clamp-3">
          {{ talk.description }}
        </p>
      </div>

      <div class="mt-4 pt-4 border-t border-zinc-300 dark:border-zinc-700 group-hover:border-white/30 dark:group-hover:border-black/30 transition-colors">
        <div v-if="talk.tags && talk.tags.length > 0" class="mb-3 flex flex-wrap gap-2">
          <Badge v-for="tag in talk.tags" :key="tag" variant="secondary" class="font-normal">
            #{{ tag }}
          </Badge>
        </div>
        <div class="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-white/70 dark:group-hover:text-black/70 transition-colors">
          {{ talk.speaker }} on {{ formatDate(talk.date) }}
        </div>
      </div>
    </article>
  </NuxtLink>
</template>
