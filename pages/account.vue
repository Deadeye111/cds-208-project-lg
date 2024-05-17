<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);

import Header from '../components/Header'

const user = useSupabaseUser()

const authMethod = ref(''); // 'login', 'magiclink', 'register'

const setAuthMethod = (method) => {
  authMethod.value = method;
};

</script>

<template>
  <main class="dark:bg-[#121212] bg-white min-h-screen pb-20">
    <Header title="Account" />
    
    <!-- Show Account info if user logged in -->
    <Account v-if="user" />
    
    <!-- Select Auth method -->
    <div v-if="!user && authMethod === ''" class="flex">
      <div class="m-auto my-40">
        <button @click="setAuthMethod('login')" class="m-2 cursor-pointer flex-shrink-0 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 py-2 px-4">Login</button>
        <button @click="setAuthMethod('magiclink')" class="m-2 cursor-pointer flex-shrink-0 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 py-2 px-4">Auth with Magic Link</button>
        <button @click="setAuthMethod('register')" class="m-2 cursor-pointer flex-shrink-0 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 py-2 px-4">Register</button>
      </div>
    </div>

    <!-- Load Auth method -->
    <LoginUsernamePassword v-else-if="!user && authMethod === 'login'" />
    <AuthMagicLink v-else-if="!user && authMethod === 'magiclink'" />
    <RegisterUsernamePassword v-else-if="!user && authMethod === 'register'" />

    <Footer />
  </main>
</template>