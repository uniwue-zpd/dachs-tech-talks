<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Mic, Lightbulb } from 'lucide-vue-next'
import {AuroraBackground} from "~/components/ui/aurora-background";
</script>
<template>
  <div class="py-12 px-6">
    <AuroraBackground class="h-fit py-12">
      <div
          class="relative flex flex-col items-center justify-center gap-4 px-4"
      >
        <div class="max-w-4xl mx-auto text-center">
          <h3 class="text-accent-foreground mb-4 text-3xl font-semibold md:text-5xl lg:mb-6 lg:text-6xl">
            Have Something to Share?
          </h3>
          <p class="text-muted-foreground mb-8 text-lg font-medium lg:text-xl">
            Your experience is valuable. Step up to the mic, or suggest a topic for others to explore.
          </p>
          <div class="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
            <Button size="lg" class="w-full sm:w-auto" as-child>
              <a href="https://github.com/your-org/your-repo/issues/new/choose" target="_blank" rel="noopener noreferrer">
                <Mic class="mr-2 h-5 w-5" />
                Submit a Talk
              </a>
            </Button>
            <Button variant="outline" size="lg" class="w-full sm:w-auto text-muted-foreground" as-child>
              <a href="https://github.com/your-org/your-repo/issues/new/choose" target="_blank" rel="noopener noreferrer">
                <Lightbulb class="mr-2 h-5 w-5" />
                Propose a Topic
              </a>
            </Button>
          </div>
        </div>
      </div>
    </AuroraBackground>
  </div>
</template>
