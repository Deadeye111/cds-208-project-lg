<script setup>
import { useDark, useToggle } from "@vueuse/core";

// Load and initialize pinia store
const canbanBoardDataStore = useCanbanBoardDataStore()
const { loadCanbanBoardData } = canbanBoardDataStore
const { boardData, barLabels, barData} = storeToRefs(canbanBoardDataStore)

const loading = ref(false)

const route = useRoute()
const boardID = route.params.id

const isDark = useDark();
const toggleDark = useToggle(isDark);

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const boardExists = ref(false)
const boardName = ref('')

const { data: canbanBoardData, error } = await supabase
  .from('canban_boards')
  .select(`board_name, created_at`)
  .eq('id', boardID)
  .eq('user_id', user.value.id)
  
if (error) {
  console.error("Error fetching board data:", error.message);
} else if (canbanBoardData && canbanBoardData.length > 0) {
    boardName.value = canbanBoardData[0].board_name;
    console.log(`Loaded board: ${boardName.value}`);
    boardExists.value = true;
    // Fetch data
    await useAsyncData('loadCanbanBoardData', async () => {
      return loadCanbanBoardData(boardID)}  // Pass boardID to load data of current board
    )
} else {
  console.log("Board does not exist..");
}

// v-model component
const newColumnName = ref('')

const createColumn = async () => {
  // Retrieve input value
  const columnName = newColumnName.value.trim();

  // Validate board name
  if (columnName==='') {
    // Handle validation error, e.g., display an error message
    alert("Column name cannot be empty");
    return;
  }

  // Insert new board into the database
  const { error } = await supabase
    .from('board_columns')
    .insert([{ title: columnName, board_id: boardID }]);

  if (error) {
    // Handle insertion error, e.g., display an error message
    console.error("Error inserting new column:", error.message);
    return;
  } else {
    // Fetch data
    loadCanbanBoardData(boardID);  // Pass boardID to load data of current board
    console.log("Board column added..")
  }

  // Clear input field after successful insertion
  newColumnName.value = ''
};

// v-model component
const newTaskName = ref('')
const newSelectedColumnID = ref('')

const createTask = async () => {
  const columnID = newSelectedColumnID.value
  // Retrieve input value
  const taskName = newTaskName.value.trim();

  // Validate board name
  if (taskName==='' || columnID==='') {
    // Handle validation error, e.g., display an error message
    alert("Column name or selection cannot be empty");
    return;
  }

  // Insert new board into the database
  const { error } = await supabase
    .from('column_tasks')
    .insert([{ title: taskName, column_id: columnID }]);

  if (error) {
    // Handle insertion error, e.g., display an error message
    console.error("Error inserting new task:", error.message);
    return;
  } else {
    // Fetch data
    loadCanbanBoardData(boardID);  // Pass boardID to load data of current board
    console.log("Board task added..")
  }

  // Clear input field after successful insertion
  newTaskName.value = ''
};

const deleteColumn = async (columnID) => {
  var result = confirm("Want to delete the column?");
  if (result) {
    const { error } = await supabase
      .from('board_columns')
      .delete()
      .eq('id', columnID)

    if (error) {
      // Handle deletion error, e.g., display an error message
      console.error("Error deleting column:", error.message);
      return;
    } else {
      // Fetch data
      loadCanbanBoardData(boardID);  // Pass boardID to load data of current board
      console.log("Board column deleted..")
    }
  }
};

const deleteTask = async (taskID) => {
  var result = confirm("Want to delete the task?");
  if (result) {
    const { error } = await supabase
      .from('column_tasks')
      .delete()
      .eq('id', taskID)

    if (error) {
      // Handle deletion error, e.g., display an error message
      console.error("Error deleting task:", error.message);
      return;
    } else {
      // Fetch data
      loadCanbanBoardData(boardID);  // Pass boardID to load data of current board
      console.log("Board task deleted..")
    }
  }
};

const updateTask = async (taskID, taskName) => {
  // Validate task name
  if (taskName==='') {
    deleteTask(taskID)
    // Fetch data
    loadCanbanBoardData(boardID);  // Pass boardID to load data of current board
    return;
  }
  
  const { error } = await supabase
    .from('column_tasks')
    .update({ title: taskName })
    .eq('id', taskID)

  if (error) {
    console.error("Error updating task:", error.message);
    return;
  } else {
    console.log("Board task updated..")
  }
};

const updatedSelectedColumnID = ref('')

const newColumn = async (taskID) => {
  const columnID = updatedSelectedColumnID.value
  const { error } = await supabase
    .from('column_tasks')
    .update({ column_id: columnID })
    .eq('id', taskID)

  if (error) {
    console.error("Error updating task column:", error.message);
    return;
  } else {
    // Fetch data
    loadCanbanBoardData(boardID);  // Pass boardID to load data of current board
    console.log("Board task column updated..")
  }

  // Clear select field
  updatedSelectedColumnID.value = ''
};

</script>

<template>
  <main class="dark:bg-[#121212] bg-white min-h-screen pb-20">
    <Header v-if="boardExists" :title=boardName />

    <!-- Info component if board does not exist -->
    <BoardNotExists v-if="!boardExists"/>

    <div v-if="boardExists" class="container mx-auto pt-5 mt-5 pl-5 pr-5">
      <div class="flex justify-center">
        <div class="grid grid-cols-1 gap-5 w-full">
          <!-- Instructions component-->
          <CanbanBoardInstructions/>

          <!-- Input field for creating a new column -->
          <div class="p-3 shadow-md rounded-lg flex-grow border-2 border-solid border-slate-200">
            <h1 class="dark:text-white text-lg font-bold w-full text-center mb-3">Create a new column</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 w-full">
              <input v-model="newColumnName" type="text" class="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" placeholder="Enter column name">
              <button @click="createColumn" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add Column</button>
            </div>
          </div>

          <!-- Dropdown for choosing a column to add a task -->
          <div class="p-3 shadow-md rounded-lg flex-grow border-2 border-solid border-slate-200">
            <h1 class="dark:text-white text-lg font-bold w-full text-center mb-3">Add task to an existing column</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 w-full">
              <select v-model="newSelectedColumnID" class="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
                <option disabled value="">Select a column</option>
                <option v-for="(column, key) in boardData" :key="key" :value="key">{{ column.title }}</option>
              </select>
              <input v-model="newTaskName" type="text" class="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" placeholder="Enter task name">
              <div></div>
              <button @click="createTask" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add Task</button>
            </div>
          </div>

          <!-- Canban board -->
          <div class="p-3 shadow-md rounded-lg flex-grow border-2 border-solid border-slate-200">
            <h1 class="dark:text-white text-lg font-bold w-full text-center mb-3">Canban board</h1>
            <p v-if="loading" class="dark:text-white font-bold text-center">Loading..</p>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
              <div v-for="(column, key) in boardData" :key="key" class="column border-2 mb-3">
                <div class="flex">
                  <h1 class="dark:text-white text-center mt-1 text-lg font-bold w-full pl-2">{{ column.title }}</h1>
                  <button @click="deleteColumn(key)" class="p-1 align-middle">
                    <img v-if="isDark" src="../../assets/icons/delete-white.svg" alt="Delete Icon" class="w-6 h-6" />
                    <img v-else src="../../assets/icons/delete-black.svg" alt="Delete Icon" class="w-6 h-6" />
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-1 p-1 w-full" v-for="(task, index) in column.tasks" :key="index">
                  <input @blur="updateTask(task.id, task.title)" type="text" v-model="task.title" class="h-8 px-2 align-middle border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
                  <select v-model="updatedSelectedColumnID" @change="newColumn(task.id)" class="h-8 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
                    <option disabled value="" selected>Change Column</option>
                    <option v-for="(column, key) in boardData" :key="key" :value="key">{{ column.title }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div v-if="barData.length > 0" class="p-3 shadow-md rounded-lg flex-grow border-2 border-solid border-slate-200">
            <h1 class="dark:text-white text-center mt-1 text-lg font-bold w-full pl-2">Number of tasks per column</h1>
            <BarChart title="" legendLabel="Count" :labels="barLabels" :data="barData" />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </main>
</template>
