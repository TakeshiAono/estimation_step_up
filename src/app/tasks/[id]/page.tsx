"use client";
import { useState } from "react";
import _ from "lodash";
import type { Task as TaskType} from "@/schema/zod";

import { useParams } from "next/navigation";
import TaskMenu from "@/app/components/TaskMenu";
import TaskArea from "@/app/components/TaskArea";

export default function TaskView() {
  const [newTaskItem, setNewTaskItem] = useState<TaskType>(null);
  const params = useParams()

  return (
    <>
      <TaskMenu onCreateTopTask={setNewTaskItem} isChildTask={true}/>
      <TaskArea createdTopTask={newTaskItem} pathParameterTaskId={params.id as string}/>
    </>
  );
}