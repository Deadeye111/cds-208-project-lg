<script setup>
definePageMeta({
  middleware: 'auth'
})

import { useDark, useToggle } from "@vueuse/core";

import Header from '../components/Header'

const isDark = useDark();
const toggleDark = useToggle(isDark);

const supabase = useSupabaseClient()

const username = ref('')

const user = useSupabaseUser()

const { data: userData } = await supabase
  .from('profiles')
  .select(`username`)
  .eq('id', user.value.id)
  .single()

if (userData) {
  username.value = userData.username
}

const boardArray = ref([]) // Initialize a ref to store board names

const loadBoards = async () => {
  const { data: canbanBoardsData } = await supabase
    .from('canban_boards')
    .select(`id, board_name, created_at`)
    .eq('user_id', user.value.id)
    
  if (canbanBoardsData) {
    boardArray.value = canbanBoardsData.map(board => ({
      id: board.id,
      name: board.board_name,
      created_at: board.created_at
    }));
    console.log("loaded data..")
  } else {
    console.log("data is null")
  }
};

// Fetch data
loadBoards()

// v-model component
const newBoardName = ref('')

const createBoard = async () => {
  // Retrieve input value
  const boardName = newBoardName.value.trim();

  // Validate board name
  if (boardName==='') {
    // Handle validation error, e.g., display an error message
    alert("Board name cannot be empty");
    return;
  }

  // Insert new board into the database
  const { error } = await supabase
    .from('canban_boards')
    .insert([{ user_id: user.value.id, board_name: boardName }]);

  if (error) {
    // Handle insertion error, e.g., display an error message
    console.error("Error inserting new board:", error.message);
    return;
  } else {
    // Fetch data
    loadBoards()
    console.log("Board added..")
  }

  // Clear input field after successful insertion
  newBoardName.value = ''
};

const deleteBoard = async (boardID) => {
  var result = confirm("Want to delete the board?");
  if (result) {
    const { error } = await supabase
      .from('canban_boards')
      .delete()
      .eq('id', boardID)

    if (error) {
      console.error("Error deleting board:", error.message);
      return;
    } else {
      // Fetch data
      loadBoards()
      console.log("Board deleted..")
    }
  }
};

const updateBoard = async (boardID, boardName) => {
  // Validate board name
  if (boardName==='') {
    alert("Board name cannot be empty");
    loadBoards()
    return;
  }

  const { error } = await supabase
    .from('canban_boards')
    .update({ board_name: boardName })
    .eq('id', boardID)

  if (error) {
    console.error("Error updating board:", error.message);
    return;
  } else {
    // Fetch data
    loadBoards()
    console.log("Board updated..")
  }
};

</script>

<template>
  <main class="dark:bg-[#121212] bg-white min-h-screen pb-20">
    <Header title="Dashboard" />

    <div class="container mx-auto pt-5 mt-5 pl-5 pr-5">
      <div class="flex justify-center">
        <div class="grid grid-cols-1 gap-5 w-full">
          <h1 class="text-xl font-bold text-center w-full h-auto dark:text-white">
            Welcome to <span v-if="username" class="bg-gradient-to-r from-[#00c6ff] to-[#0072ff] bg-clip-text text-transparent font-semibold drop-shadow">{{ username }}'s</span> Canban Dashboard
          </h1>

          <div class="flex flex-col items-center p-3 shadow-md rounded-lg border-2 border-solid border-slate-200">
            <h1 class="dark:text-white text-lg font-bold w-full text-center mb-3">Create Boards</h1>
            <div class="flex items-center justify-center">
              <input type="text" v-model="newBoardName" placeholder="Canban board Name.." class="px-4 py-2 sm:w-52 md:w-72 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
              <button @click="createBoard" class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add</button>
            </div>
          </div>

          <div class="flex flex-col items-center p-3 shadow-md rounded-lg border-2 border-solid border-slate-200">
            <h1 class="dark:text-white text-lg font-bold w-full text-center mb-3">List of Boards</h1>
            <ul>
              <li v-for="(board, index) in boardArray" :key="index" class="dark:text-white mb-4">
                <div class="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                  <div class="flex items-center mt-2 lg:mt-0">
                    <span class="mr-2">Name:</span>
                    <input @blur="updateBoard(board.id, board.name)" type="text" v-model="board.name" class="px-2 py-1 text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
                  </div>
                  <div class="mt-2 lg:mt-0">Created at: {{ new Date(board.created_at).toLocaleString('de-CH', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}</div>
                  <NuxtLink :to="`/canbanBoard/${board.id}`" class="text-center bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600 mt-2 lg:mt-0">View</NuxtLink>
                  <button @click="deleteBoard(board.id)" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2 lg:mt-0">Delete</button>
                  <hr class="mt-5" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </main>
</template>