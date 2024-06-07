export const useCanbanBoardDataStore = defineStore('canbanBoardDataStore', () => {
  // Define arrays and variables for data
  const boardData = reactive({});
  const barLabels = ref([]);
  const barData = ref([]);

  async function loadCanbanBoardData(boardID) {
    // Empty boardData
    for (const key in boardData) {
      delete boardData[key];
    }

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    
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
      console.log("data is null..");
    }
  }
  return { loadCanbanBoardData, boardData, barLabels, barData }
})
