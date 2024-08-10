"use client";

import { useState } from "react";
import Task from "./components/Task";
import Timer from "./components/Timer";
import _ from "lodash";
import Nestable from 'react-nestable';
import { Button } from "@mui/material";
import Link from "next/link";

export default function TaskView() {
  const createTaskItems = (taskIds: number[]) => {
    return taskIds.map(taskId => {
      return ({ id : taskId, children: null})
    })
  }

  const [seconds, setSeconds] = useState(0);
  const [taskItems, setTaskItems] = useState<{ id: number; component: Element, children: any }[]>(createTaskItems([0,1,2,3]))
  const [isHidden, setIsHidden] = useState(false)

  const renderTask = ({ item }: {item: any}) => <Task key={item.id} seconds={seconds} id={item.id} />;

  return (
    <>
      { isHidden
        ? <Button variant="contained" onClick={() => {setIsHidden(!isHidden)}}>下層タスク表示</Button>
        : <Button variant="contained" onClick={() => {setIsHidden(!isHidden)}}>下層タスク非表示</Button>
      }
      <Link style={{display: "inline-block", marginLeft: "30px"}} href="/tickets">
        <p>チケット一覧へ</p>
      </Link>
      { taskItems &&
        <Nestable
          items={taskItems}
          renderItem={renderTask}
          onChange={(event) => {setTaskItems(event.items)}}
          disableCollapse={true}
          disableDrag={false}
          collapsed={isHidden}
        />
      }
      <Timer
        onTimerUpdate={(totalSeconds: number) => {
          setSeconds(totalSeconds);
        }}
      />
    </>
  );
}
