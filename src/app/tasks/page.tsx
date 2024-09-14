"use client";

import { useState } from "react";
import _ from "lodash";
import type { Task as TaskType } from "@/schema/zod";
import TaskArea from "../components/TaskArea";
import TaskMenu from "../components/TaskMenu";

export default function TaskView() {
  const [newTaskItem, setNewTaskItem] = useState<TaskType>(null);
  const [isMinimum, setIsMinimum] = useState(true);

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
