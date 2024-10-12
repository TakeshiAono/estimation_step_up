"use client";
// FIXME: use clientを外してcomponentにTaskViewを映すべし

import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import type { Task as TaskType } from "@/schema/zod";
import TaskArea from "../components/TaskArea";
import TaskMenu from "../components/TaskMenu";
import {
  fetchAllTickets,
  getTickets,
  setTickets,
} from "../features/ticketSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { Statuses } from "../constants/TaskConstants";
import dayjs from "dayjs";

export default function TaskView() {
  const [newTaskItem, setNewTaskItem] = useState<TaskType>(null);
  const [isMinimum, setIsMinimum] = useState(true);

  const tickets = useSelector(getTickets)
    .map((ticket) => {
      if (!ticket.isNotified && ticket.status != Statuses.Done)
        return {
          title: ticket.title,
          isNotified: ticket.isNotified,
          deadline: ticket.deadline,
        };
    })
    .filter((ticket) => ticket);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllTickets());
    Notification.requestPermission()
  }, [dispatch]);

  useEffect(() => {
    // TODO: イベントループではウインドウがアクティブではない場合に止まってしまうため、サービスワーカーに移設する
    setInterval(
      () => {
        tickets.forEach((ticket) => {
          // TODO: バグがあります。当日なのに1日の差がある
          if (!ticket?.isNotified && dayjs(ticket.deadline, "d") == dayjs()) {
            new Notification("本日締め切り当日", { body: ticket.title });
          }
          if (!ticket?.isNotified && dayjs().diff(ticket.deadline, "d") == 1) {
            new Notification("本日締め切り1日前", { body: ticket.title });
          }
          if (!ticket?.isNotified && dayjs().diff(ticket.deadline, "d") == 2) {
            new Notification("本日締め切り2日前", { body: ticket.title });
          }
        });
        console.log("a")
      },
      1000 * 60 * 60,
    );
  }, [tickets]);

  return (
    <div style={{ width: "100%" }}>
      <TaskMenu
        onCreateTopTask={setNewTaskItem}
        onMinimum={setIsMinimum}
        isMinimum={isMinimum}
      />
      <TaskArea createdTopTask={newTaskItem} isMinimum={isMinimum} />
    </div>
  );
}
