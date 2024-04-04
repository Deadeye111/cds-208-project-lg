<template>
  <footer class="border-t border-black bg-slate-100 dark:bg-[#121212] dark:border-white fixed bottom-0 left-0 right-0">
      <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <ul class="flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
              <NuxtLink to="/" class="hover:underline me-4 md:me-6">Home</NuxtLink>
          </li>
          <li>
              <NuxtLink to="/overview" class="hover:underline me-4 md:me-6">Account</NuxtLink>
          </li>
      </ul>
      </div>
  </footer>
</template>

<script setup>
</script>