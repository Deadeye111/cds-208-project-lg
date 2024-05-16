<script setup>
definePageMeta({
  middleware: 'auth'
})

const loading = ref(false)

const route = useRoute()
const boardID = route.params.id

import { useDark, useToggle } from "@vueuse/core";
import BarChart from '../../components/BarChart'

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
} else {
  console.log("Board data is null or empty");
}

// Define a reactive global variable using Vue 3's reactive
const boardData = reactive({});
const barLabels = ref([]);
const barData = ref([]);

const loadEntries = async () => {
  loading.value = true

  // Empty boardData
  for (const key in boardData) {
    delete boardData[key];
  }
  
  const { data: canbanBoardColumns } = await supabase
    .from('board_columns')
    .select(`id, title, created_at`)
    .eq('board_id', boardID);
  
  if (canbanBoardColumns && canbanBoardColumns.length > 0) {
    for (const column of canbanBoardColumns) {
      const columnID = column.id;
      const tasks = await supabase
        .from('column_tasks')
        .select(`id, title, created_at`)
        .eq('column_id', columnID);
      // Add tasks to object boardData
      boardData[columnID] = {
        title: column.title,
        created_at: column.created_at,
        tasks: tasks.data || [] // tasks.data will be an array of tasks or empty if no tasks found
      };
    }
    barLabels.value = Object.values(boardData).map(column => column.title);
    barData.value = Object.values(boardData).map(column => column.tasks.length);
    
    console.log("loaded data..")
  } else {
    console.log("data is null");
  }
  loading.value = false
};

// Fetch data
loadEntries()

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
    loadEntries()
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
    loadEntries()
    console.log("Board task added..")
  }

  // Clear input field after successful insertion
  newTaskName.value = ''
};

const deleteColumn = async (columnID) => {
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
    loadEntries()
    console.log("Board column deleted..")
  }
};

const deleteTask = async (taskID) => {
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
    loadEntries()
    console.log("Board task deleted..")
  }
};

const updateTask = async (taskID, taskName) => {
  // Validate task name
  if (taskName==='') {
    deleteTask(taskID)
    // Fetch data
    loadEntries()
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
    loadEntries()
    console.log("Board task column updated..")
  }

  // Clear select field
  updatedSelectedColumnID.value = ''
};

</script>

<template>
  <main class="dark:bg-[#121212] bg-white min-h-screen pb-20">
    <Header v-if="boardExists" :title=boardName />

    <div v-if="!boardExists" class="flex justify-between relative">
      <div class="border-2 border-solid border-slate-700 dark:border-slate-200 p-10 mt-20 text-lg text-red-600 text-center m-auto">
        <p>Board does not exist</p>
        <br>
        <NuxtLink to="/dashboard">
            <button class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                To your dashboard
            </button>
        </NuxtLink>
      </div>
    </div>

    <div v-if="boardExists" class="container mx-auto pt-5 mt-5 pl-5 pr-5">
      <div class="flex justify-center">
        <div class="grid grid-cols-1 gap-5 w-full">
          <!-- Input field for creating a new column -->
          <div class="p-3 shadow-md rounded-lg flex-grow border-2 border-solid border-slate-200">
            <h1 class="dark:text-white text-lg font-bold w-full text-center mb-3">Create a new column</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 w-full">
              <input v-model="newColumnName" type="text" class="py-2 px-3 rounded border border-gray-300 focus:outline-none focus:border-indigo-500" placeholder="Enter column name">
              <button @click="createColumn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add Column</button>
            </div>
          </div>

          <!-- Dropdown for choosing a column to add a task -->
          <div class="p-3 shadow-md rounded-lg flex-grow border-2 border-solid border-slate-200">
            <h1 class="dark:text-white text-lg font-bold w-full text-center mb-3">Add task to an existing column</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 w-full">
              <select v-model="newSelectedColumnID" class="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-600 focus:border-indigo-600">
                <option disabled value="">Select a column</option>
                <option v-for="(column, key) in boardData" :key="key" :value="key">{{ column.title }}</option>
              </select>
              <input v-model="newTaskName" type="text" class="py-2 px-3 rounded border border-gray-300 focus:outline-none focus:border-indigo-600" placeholder="Enter task name">
              <div></div>
              <button @click="createTask" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add Task</button>
            </div>
          </div>

          <!-- Canban board -->
          <div class="p-3 shadow-md rounded-lg flex-grow border-2 border-solid border-slate-200">
            <h1 class="dark:text-white text-lg font-bold w-full text-center mb-3">Canban board</h1>
            <p v-if="loading">Loading..</p>
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
                  <input @blur="updateTask(task.id, task.title)" type="text" v-model="task.title" class="h-8 align-middle border border-gray-300 rounded-md px-2 py-1 text-black">
                  <select v-model="updatedSelectedColumnID" @change="newColumn(task.id)" class="h-8 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option disabled value="" selected>Change Column</option>
                    <option v-for="(column, key) in boardData" :key="key" :value="key">{{ column.title }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="p-3 shadow-md rounded-lg flex-grow border-2 border-solid border-slate-200">
            <BarChart title="Number of Tasks per Column" legendLabel="Count" :labels="barLabels" :data="barData" />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </main>
</template>
