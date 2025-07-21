<script setup>
const { path } = useRoute()
const { data } = await useAsyncData(path, () => {
  return queryCollection('talks').path(path).first()
})
</script>

<template>
  <main>
    <TalkContent v-if="data" :data="data" />
    <div v-else>
      <p>Document not found.</p>
    </div>
  </main>
</template>
