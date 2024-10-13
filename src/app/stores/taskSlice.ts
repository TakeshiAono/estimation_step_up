import { Task } from "@prisma/client";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { groupBy } from "lodash";
import { RootState } from "../store";

// NOTE: 状態は変えず参照するだけの場合はselectorを使う
export const getTasksGroupedByTicket = createSelector(
  (state) => state.task.tasks, // tasks 状態を取得
  (tasks) => groupBy(tasks, (task) => task.ticketId), // ticketId でグループ化
);

export const getTasksByTicketId = createSelector(
  [
    (state: RootState) => state.task.tasks, // tasks 状態を取得
    (_: RootState, ticketId: number) => ticketId, // ticketIdを引数として受け取る
  ],
  (tasks, ticketId) => tasks.filter((task) => task.ticketId == ticketId), // ticketIdでフィルタリング
);

export const getAllTasks = createSelector(
  (state) => state.task.tasks,
  (tasks) => tasks,
);

export const fetchAllTasks = createAsyncThunk(
  "task/fetchAllTasks",
  async () => {
    const { data } = await axios.get(`http://localhost:3001/api/tasks`);
    console.log("response", data);
    return data;
  },
);

export const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
  },

  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload; // 新しいタスクをtasks配列に追加
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAllTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setTasks } = taskSlice.actions;

export default taskSlice.reducer;
