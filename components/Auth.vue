<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({ email: email.value })
    if (error) throw error
    alert('Check your email for the login link!')
  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-between relative">
    <div class="w-full pt-10 pb-10 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 relative">
      <h1 class="xl:text-7xl md:text-5xl text-4xl text-white text-center">
        Sign up
      </h1>
    </div>
  </div>
  
  <div class="flex">
    <div class="m-auto my-40">
      <p class="text-lg dark:text-white mb-5">Sign in via magic link with your email below</p>
      
      <form class="w-full max-w-sm" @submit.prevent="handleLogin">
        <div class="flex items-center border-b border-teal-500 py-2">
          <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="email" placeholder="Your email" v-model="email" />
          <input
              type="submit"
              class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              :value="loading ? 'Loading' : 'Send magic link'"
              :disabled="loading"
            />
        </div>
      </form>
    </div>
  </div>
</template>