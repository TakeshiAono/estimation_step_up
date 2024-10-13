import React from "react";
import _ from "lodash";

import { getHoliday } from "../components/ServerComponent";
import TicketView from "../components/TicketView";
import { Ticket } from "@/schema/zod";
import { Statuses } from "../constants/TaskConstants";
import {
  fetchBusinessTermSetting,
  fetchTasks,
  fetchTickets,
} from "../utils/apiUtil";

export default async function TicketPage() {
  const tickets = await fetchTickets();
  const [startBusinessTime, endBusinessTime] = await fetchBusinessTermSetting();
  return (
    <>
      <TicketView
        holidayList={getHoliday()}
        startBusinessTimeProp={startBusinessTime}
        endBusinessTimeProp={endBusinessTime}
        convertTickets={optimizeTickets(tickets)}
        tasks={await fetchTasks()}
      />
    </>
  );
}

const optimizeTickets = (tickets: Ticket[]) => {
  return tickets.map((ticket) => {
    const { status, ...others } = ticket;
    const stringStatusCode = _.findKey(Statuses, (value) => value === status);
    return { status: stringStatusCode, ...others };
  });
};
