import { Task } from "@/schema/zod";
import { Button } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Statuses, TaskTypes } from "../constants/TaskConstants";

type Props = {
  onCreateTopTask: (task: Task) => void;
  onMinimum?: (isMinimum: boolean) => void;
  isMinimum?: boolean;
  isChildTask?: boolean;
}

const TaskMenu = (
  {
    onCreateTopTask,
    onMinimum,
    isMinimum,
    isChildTask
  }: Props) => {
  const [isHidden, setIsHidden] = useState(false);

  const createNewTask = async () => {
    try {
      const { data } = await storeTask({
        isSurveyTask: true,
        status: Statuses.NotYet,
        type: TaskTypes.FirstTask,
        title: "",
      });
      onCreateTopTask(data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const storeTask = async ({
    isSurveyTask,
    status,
    type,
    title,
    parentId = null,
    ticketId = null,
  }: Task) => {
    return await axios.post<Task>(
      `http://localhost:3001/api/tasks/create`,
      JSON.stringify({
        isSurveyTask: isSurveyTask,
        status: status,
        type: type,
        ticketId: ticketId,
        title: title,
        parentId: parentId,
      })
    );
  };

  return (
  <>
    <Button
      variant="contained"
      color="warning"
      style={{ marginRight: "20px" }}
    >
      タスク更新
    </Button>
    <Button
      variant="contained"
      color="success"
      style={{ marginRight: "20px" }}
      onClick={() => {
        if(onMinimum) onMinimum(prev => !prev);
      }}
    >
      {isMinimum ? "タスク通常表示" : "タスク最小表示"}
    </Button>
    <Button
      variant="contained"
      onClick={() => {
        setIsHidden(!isHidden);
      }}
    >
      {isHidden ? "下層タスク表示": "下層タスク非表示"}
    </Button>
    <Link
      style={{ display: "inline-block", marginLeft: "30px" }}
      href="/tickets"
    >
      <p>チケット一覧へ</p>
    </Link>
    {isChildTask ||
      <>
        <Button variant="contained" onClick={createNewTask}>
          タスク追加
        </Button>
      </>
    }
    {isChildTask &&
        <Link
          style={{ display: "inline-block", marginLeft: "30px" }}
          href="/tasks"
        >
          <p>タスク一覧へ</p>
        </Link>
    }
  </>
  );
};

export default TaskMenu;
