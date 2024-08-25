"use client";

import { useEffect, useState } from "react";
import _ from "lodash";
import type { Task as TaskType} from "@/schema/zod";
import TaskArea from "../components/TaskArea";
import TaskMenu from "../components/TaskMenu";
import axios from "axios";

export default function TaskView() {
  const [newTaskItem, setNewTaskItem] = useState<TaskType>(null);
  const [isMinimum, setIsMinimum] = useState(true);
  const [ticketItems, setTicketItems] = useState<any>([]);

  // TODO: ticketsはstoreで状態管理させる
  useEffect(() => {
    const fetchTickets = async () => {
      const { data } = await axios.get("http://localhost:3001/api/tickets");
      console.log(data);
      return data.sort((item) => item.id).reverse();
    };
    fetchTickets().then((reuslt) => {
      setTicketItems(reuslt);
    });
  }, []);

  return (
    <>
      <TaskMenu onCreateTopTask={setNewTaskItem} onMinimum={setIsMinimum} isMinimum={isMinimum}/>
      <TaskArea createdTopTask={newTaskItem} isMinimum={isMinimum}/>
    </>
  );
}
