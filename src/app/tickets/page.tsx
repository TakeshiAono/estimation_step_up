import React from "react";
import { getHoliday } from "../components/ServerComponent";
import TicketView from "../components/TicketView";
import axios from "axios";
import dayjs from "dayjs";
import { Ticket } from "@/schema/zod";
import { Statuses } from "../constants/TaskConstants";
import _ from "lodash";

export default async function TicketPage() {
  const holidayList = getHoliday();
  const [startBusinessTime, endBusinessTime] = await fetchSetting();

  const tickets = await fetchTickets();
  const convertTickets = tickets.map((ticket) => {
    const { status, ...others } = ticket;
    const stringStatusCode = _.findKey(Statuses, (value) => value === status);
    return { status: stringStatusCode, ...others };
  });

  const { data } = await axios.get(`http://localhost:3001/api/tasks`);

  return (
    <>
      <TicketView
        holidayList={holidayList}
        startBusinessTimeProp={startBusinessTime}
        endBusinessTimeProp={endBusinessTime}
        convertTickets={convertTickets}
        tasks={data}
      />
    </>
  );
}

const fetchSetting = async () => {
  try {
    const { data } = await axios.get<{
      startBusinessTime: string;
      endBusinessTime: string;
    }>(`http://localhost:3001/api/settings/dummy`);
    return [
      dayjs(data.startBusinessTime).format(),
      dayjs(data.endBusinessTime).format(),
    ];
  } catch (error) {
    console.log("Error", error);
    return [];
  }
};

const fetchTickets = async () => {
  const { data } = await axios.get<Ticket[]>(
    "http://localhost:3001/api/tickets",
  );
  return data.sort((item) => item.id).reverse();
};
