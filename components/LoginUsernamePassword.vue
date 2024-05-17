<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error
  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>  
  <div class="flex p-4">
    <div class="m-auto my-40">
      <p class="text-lg dark:text-white mb-5">Login with email and password below</p>
      
      <form class="w-full max-w-lg" @submit.prevent="handleLogin">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 w-full">
          <input class="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" type="email" placeholder="Your email" v-model="email" required/>
          <input class="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" type="password" placeholder="Your password" v-model="password" required/>
          <input
              type="submit"
              class="cursor-pointer flex-shrink-0 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 py-2 px-4"
              :value="loading ? 'Loading' : 'Login'"
              :disabled="loading"
            />
        </div>
      </form>
    </div>
  </div>
</template>