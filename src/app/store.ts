import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import taskReducer from "./features/taskSlice";
import ticketReducer from "./features/ticketSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    task: taskReducer,
    ticket: ticketReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
