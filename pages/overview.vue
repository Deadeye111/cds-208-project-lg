<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);

import Header from '../components/Header'

const user = useSupabaseUser()
</script>

<template>
  <main class="dark:bg-[#121212] bg-white min-h-screen pb-20">
    <Header title="Account" />
    <Account v-if="user" />
    <Auth v-else />
    <Footer />
  </main>
</template>