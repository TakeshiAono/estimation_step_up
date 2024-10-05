import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { groupBy, keys, map } from "lodash"

// NOTE: 状態は変えず参照するだけの場合はselectorを使う
export const getTasksByTicket = createSelector(
  (state) => state.task.tasks,  // tasks 状態を取得
  (tasks) => groupBy(tasks, task => task.ticketId)  // ticketId でグループ化
);

export const fetchAllTasks = createAsyncThunk(
  "task/fetchAllTasks",
  async () => {
    const {data} = await axios.get(`http://localhost:3001/api/tasks`)
    console.log("response",data)
     return data
  }
)

export const taskSlice = createSlice({
  name: 'task',
  initialState: {
    value: 100,
    tasks: [],
  },

  reducers: {
    taskIncrement: (state) => {
      state.value += 1
    },
    taskDecrement: (state) => {
      state.value -= 1
    },
    taskIncrementByAmount: (state, action) => {
      state.value += action.payload
    },
    // fetchAllTasks: async () => {
    //   return await axios.get(`http://localhost:3001/api/tasks`);
    // },
    getTasksByTicket: (state) => {
      // state.tasks
      return groupBy(state.tasks, task => task.ticketId)
    }
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAllTasks.fulfilled, (state, action) => {
      console.log(
        keys(groupBy(action.payload, task => task.ticketId))
        // map(groupBy(action.payload, task => task.ticketId), (key,value) => key)
        // groupBy(action.payload, task => task.ticketId).keys
      )
      state.tasks = action.payload
    })
  },
})

// Action creators are generated for each case reducer function
export const { taskIncrement, taskDecrement, taskIncrementByAmount } = taskSlice.actions

export default taskSlice.reducer