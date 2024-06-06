<template>
  <div class="flex flex-col items-center p-3 shadow-md rounded-lg flex-grow border-2 border-solid border-slate-200">
    <h1 class="dark:text-white text-lg font-bold w-full text-center mb-3">How to use this Canban Board?</h1>
    <p class="text-md text-center w-full h-auto dark:text-white">
      Tasks get updated automatically after the text in the input field was changed<br>To delete a task just empty the input field<br>To move a task choose the new column from the dropdown
    </p>
    <NuxtLink to="/dashboard">
        <button class="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-2 px-4 rounded">
            Back to dashboard
        </button>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>