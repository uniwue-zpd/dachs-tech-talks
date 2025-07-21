<script setup>
const { path } = useRoute()
const { data } = await useAsyncData(path, () => {
  return queryCollection('proposals').path(path).first()
})
</script>

<template>
  <main>
    <ProposalContent v-if="data" :data="data" />
    <div v-else>
      <p>Document not found.</p>
    </div>
  </main>
</template>
