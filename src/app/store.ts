import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./stores/counterSlice";
import taskReducer from "./stores/taskSlice";
import ticketReducer from "./stores/ticketSlice";

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
