<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);

const user = useSupabaseUser()
</script>

<template>
  <main class="dark:bg-[#121212] bg-white min-h-screen pb-20">
    <Account v-if="user" />
    <Auth v-else />
    <Footer />
  </main>
</template>