<template>
  <div
      class="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg lg:w-full md:w-full"
  >
    <LayoutLogo />
    <Ripple
        class="bg-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"
        circle-class="border-[hsl(var(--primary))] bg-primary/25 blobed"
    />
  </div>
</template>

<script setup lang="ts">
import {Ripple} from "~/components/ui/ripple";
</script>
<style scoped>
:deep(.blobed) {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
}
</style>
