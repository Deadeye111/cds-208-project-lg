<script setup>
const supabase = useSupabaseClient()

const loading = ref(true)
const username = ref('')

loading.value = true
const user = useSupabaseUser()

const { data } = await supabase
  .from('profiles')
  .select(`username`)
  .eq('id', user.value.id)
  .single()

if (data) {
  username.value = data.username
}

loading.value = false

async function updateProfile() {
  try {
    loading.value = true
    const user = useSupabaseUser()

    const updates = {
      id: user.value.id,
      username: username.value,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-between relative">
    <div class="w-full pt-10 pb-10 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 relative">
      <h1 class="xl:text-7xl md:text-5xl text-4xl text-white text-center">
        Account
      </h1>
    </div>
  </div>

  <div class="flex">
    <div class="m-auto my-40">
      <p class="text-lg dark:text-white mb-5">Sign in via magic link with your email below</p>
      <form class="w-full max-w-sm" @submit.prevent="updateProfile">
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
              Email
            </label>
          </div>
          <div class="md:w-2/3">
            <input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 cursor-not-allowed" id="email" type="text" :value="user.email" disabled />
          </div>
        </div>

        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="username">
              Username
            </label>
          </div>
          <div class="md:w-2/3">
            <input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="username" type="text" v-model="username" />
          </div>
        </div>

        <div class="flex items-center">
          <div class="md:w-1/3"></div>
          <div class="md:w-1/3">
            <input
              type="submit"
              class="hover:cursor-pointer shadow bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              :value="loading ? 'Loading ...' : 'Update'"
              :disabled="loading"
            />
          </div>

          <div class="md:w-1/3 pl-5">
            <button
              class="hover:cursor-pointer shadow bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              @click="signOut"
              :disabled="loading"
            >
            Sign Out
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>