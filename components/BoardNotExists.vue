<template>
  <div class="flex justify-between relative">
    <div class="shadow-md rounded-lg border-2 border-solid border-slate-200 p-10 mt-20 text-lg text-red-600 text-center m-auto">
      <p>Board does not exist!</p>
      <br>
      <NuxtLink to="/dashboard">
          <button class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
              To your dashboard
          </button>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>