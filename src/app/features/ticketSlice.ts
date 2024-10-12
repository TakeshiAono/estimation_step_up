import axios from "axios";

import { Ticket } from "@prisma/client";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

export const getTickets = createSelector<
  [(state: { ticket: { tickets: Ticket[] } }) => Ticket[]],
  Ticket[]
>(
  (state) => state.ticket.tickets,
  (tickets) => {
    return tickets;
  },
);

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
