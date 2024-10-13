"use client";
// FIXME: use clientを外してcomponentにTaskViewを映すべし

import { useState } from "react";
import _ from "lodash";
import { useParams } from "next/navigation";

import type { Task } from "@/schema/zod";
import TaskMenu from "@/app/components/TaskMenu";
import TaskArea from "@/app/components/TaskArea";

export default function TaskView() {
  const [addTaskItem, setAddTaskItem] = useState<Task | null>(null);
  const params = useParams();

  return (
    <>
      <TaskMenu onCreateTopTask={setAddTaskItem} isChildTask={true} />
      <TaskArea
        addTopTask={addTaskItem}
        pathParameterTaskId={params.id as string}
      />
    </>
  );
}
