import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import taskReducer from "./features/taskSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    task: taskReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
