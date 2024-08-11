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
  const taskIds = [1,2,3].sort().reverse()
  const [taskItems, setTaskItems] = useState<{ id: number; children: any }[]>(createTaskItems(taskIds))
  const [isHidden, setIsHidden] = useState(false)

  const renderTask = ({ item }: {item: any}) => <Task key={item.id} seconds={seconds} id={item.id} />;

  const createTask = () => {
    const foundItem = _.maxBy(taskItems, (item) => item.id)

    let nextId
    if (foundItem) {
      nextId = foundItem.id + 1
    } else {
      nextId = 1
    }

    setTaskItems([{ id: nextId, children: [] }, ...taskItems])
  }

  return (
    <>
      { isHidden
        ? <Button variant="contained" onClick={() => {setIsHidden(!isHidden)}}>下層タスク表示</Button>
        : <Button variant="contained" onClick={() => {setIsHidden(!isHidden)}}>下層タスク非表示</Button>
      }

      <Link target={"_blank"} style={{display: "inline-block", marginLeft: "30px"}} href="/tickets">
        <p>チケット一覧へ</p>
      </Link>
      <Button variant="contained" onClick={createTask}>タスク追加</Button>
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
