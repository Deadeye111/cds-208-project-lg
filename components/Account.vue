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
  // Validate username
  if (username.value==='') {
    // Handle validation error, e.g., display an error message
    alert("Username cannot be empty");
    return;
  }
  else {
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
  <div class="flex p-4">
    <div class="m-auto my-20">
      <p class="text-lg dark:text-white mb-5 flex-grow">Your account informations</p>
      
      <form class="w-full max-w-xl" @submit.prevent="updateProfile">
        <div class="grid grid-cols-1 gap-1 w-full">
          <label class="text-gray-500 font-bold pr-4" for="email">
            Email
          </label>
          <input class="bg-gray-200 cursor-not-allowed appearance-none w-full py-2 px-4 leading-tight text-black border border-gray-300 rounded-md" id="email" type="text" :value="user.email" disabled />

          <label class="mt-2 text-gray-500 font-bold pr-4" for="username">
            Username
          </label>
          <input class="appearance-none w-full py-2 px-4 leading-tight text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" id="username" type="text" v-model="username" />

          <div class="mt-5 grid grid-cols-2 gap-1 w-full">
            <input
              type="submit"
              class="hover:cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 py-2 px-4"
              :value="loading ? 'Loading ...' : 'Update'"
              :disabled="loading"
            />

            <button
              class="hover:cursor-pointer bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 py-2 px-4"
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