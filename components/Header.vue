<template>
  <div class="flex justify-between relative">
    <div class="border-b border-black dark:border-white w-full pt-10 pb-10 bg-slate-100 dark:bg-[#121212] relative">
      <h1 class="xl:text-7xl md:text-5xl text-4xl text-center">
        <span class="bg-gradient-to-r from-blue-600 via-indigo-400 to-green-500 bg-clip-text text-transparent font-semibold drop-shadow">{{ title }}</span>
      </h1>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    default: 'DataFlowCanban'
  }
})
</script>