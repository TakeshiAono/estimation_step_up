"use client";
// FIXME: use clientを外してcomponentにTaskViewを映すべし

import { useEffect, useState } from "react";
import _ from "lodash";
import dayjs from "dayjs";

import type { Task } from "@/schema/zod";
import TaskArea from "../components/TaskArea";
import TaskMenu from "../components/TaskMenu";
import { getNotifyAbleTickets } from "../stores/ticketSlice";
import { useSelector } from "react-redux";

export default function TaskView() {
  const [addTaskItem, setAddTaskItem] = useState<Task | null>(null);
  const [isMinimumDisplay, setIsMinimumDisplay] = useState(true);

  const notifyAbleTickets = useSelector(getNotifyAbleTickets);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    setInterval(
      () => {
        notifyAbleTickets.forEach((ticket) => {
          const diff = dayjs().diff(ticket.deadline, "d");
          if (!ticket?.isNotified && diff === 0) {
            new Notification("👀締め切り当日", { body: ticket.title });
          } else if (!ticket?.isNotified && diff === 1) {
            new Notification("🔴締め切り1日前", { body: ticket.title });
          } else if (!ticket?.isNotified && diff === 2) {
            new Notification("❗️締め切り2日前", { body: ticket.title });
          } else if (!ticket?.isNotified && diff > 2) {
            new Notification("❌大幅な遅れ(2日以上)", { body: ticket.title });
          }
        });
      },
      1000 * 60 * 60,
    );
  }, [notifyAbleTickets]);

  return (
    <div style={{ width: "100%" }}>
      <TaskMenu
        onCreateTopTask={setAddTaskItem}
        onMinimumDisplay={setIsMinimumDisplay}
        isMinimumDisplay={isMinimumDisplay}
      />
      <TaskArea addTopTask={addTaskItem} isMinimumDisplay={isMinimumDisplay} />
    </div>
  );
}
