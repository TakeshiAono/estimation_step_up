import React from "react";
import { getHoliday } from "../components/ServerComponent";
import TicketView from "../components/TicketView";

export default function TicketPage() {
  const holidayList = getHoliday()

  return (
    <>
      <TicketView holidayList={holidayList}/>
    </>
  );
}
