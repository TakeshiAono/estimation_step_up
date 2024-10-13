import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Ticket } from "@prisma/client";
import { Statuses } from "../constants/TaskConstants";
import { RootState } from "../store";

const selectTickets = (state: RootState) => state.ticket.tickets;

export const getTickets = createSelector<
  [(state: RootState) => Ticket[]],
  Ticket[]
>([selectTickets], (tickets) => {
  return tickets;
});

export const getNotifyAbleTickets = createSelector<
  [(state: RootState) => Ticket[]],
  { title: string; isNotified: boolean; deadline: Dayjs }[]
>([selectTickets], (tickets) => {
  return tickets
    .filter(
      (ticket) =>
        ticket.deadline &&
        !ticket.isNotified &&
        ticket.status !== Statuses.Done,
    )
    .map((ticket) => ({
      title: ticket.title,
      isNotified: ticket.isNotified,
      deadline: dayjs(ticket.deadline as Date),
    }));
});

export const fetchAllTickets = createAsyncThunk(
  "ticket/fetchAllTickets",
  async () => {
    const { data } = await axios.get(`http://localhost:3001/api/tickets`);
    console.log("response", data);
    return data;
  },
);

export const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    tickets: [],
  },

  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAllTickets.fulfilled, (state, action) => {
      state.tickets = action.payload;
    });
  },
});

export const { setTickets } = ticketSlice.actions;

export default ticketSlice.reducer;
