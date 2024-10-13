"use client";
// FIXME: use clientを外してcomponentにTaskViewを映すべし

import { useState } from "react";
import _ from "lodash";

import type { Task } from "@/schema/zod";
import TaskArea from "../components/TaskArea";
import TaskMenu from "../components/TaskMenu";
import useTicketNotification from "../hooks/useTicketNotification";

export default function TaskView() {
  const [addTaskItem, setAddTaskItem] = useState<Task | null>(null);
  const [isMinimumDisplay, setIsMinimumDisplay] = useState(true);

  useTicketNotification();

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
