"use client";

import { useEffect, useState } from "react";
import Task from "./components/Task";
import Timer from "./components/Timer";
import _ from "lodash";
import Nestable from 'react-nestable';
import { Button } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { Statuses, TaskTypes } from "./constants/TaskConstants";
import type { Task } from "@/schema/zod";

export default function TaskView() {
  const [seconds, setSeconds] = useState(0);
  const [taskItems, setTaskItems] = useState<Task[]>([])
  const [isHidden, setIsHidden] = useState(false)
  const [operatingTaskId, setOperatingTaskId] = useState(null)

  const renderTask = ({ item }: {item: Task}) => {return (
    <>
      <Task 
        key={item.id}
        seconds={seconds}
        onSelectOperatingTask={setOperatingTaskId}
        operatingTaskId={operatingTaskId} task={item}
        achievements={item.achievements[0]}
        plans={item.plans[0]}
        feedbacks={item.feedbacks[0]}
        checks={item.checks[0]}
        onDelete={deleteTask}
      />
    </>
  )};

  useEffect(() => {
    const fetchTaskItems = async () => {
      const {data} = await fetchTasks()
      return data
    }
    
    fetchTaskItems().then((data) => {
      setTaskItems(data)
    })
  }, [])
  
  const createNewTask = async () => {
    const foundItem = _.maxBy(taskItems, (item) => item.id)
    let nextId
    if (foundItem) {
      nextId = foundItem.id + 1
    } else {
      nextId = 1
    }

    try {
      const { data } = await storeTask({isSurveyTask: false, status: Statuses.NotYet, type: TaskTypes.FirstTask, title: ""})
      setTaskItems([{ ...data, id: nextId, children: [] }, ...taskItems])
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  const storeTask = async ({isSurveyTask, status, type, title, parentId = null, ticketId = null}: Task) => {
    return await axios.post<Task>(`http://localhost:3000/api/tasks/create`,
      JSON.stringify({
        isSurveyTask: isSurveyTask,
        status: status,
        type: type,
        ticketId: ticketId,
        title: title,
        parentId: parentId,
      })
    )
  }

  const storeTasks = async (items) => {
    return await axios.put<Task>(`http://localhost:3000/api/tasks/bulk`,
      JSON.stringify(items)
    )
  }

  const deleteTask = async ({id}: {id: number}) => {
    const response =  await axios.delete(`http://localhost:3000/api/tasks/${id}`)
    if(response.status === 200) {
      const exclusionTaskItems = _.filter(taskItems, taskItem => taskItem.id !== id)
      setTaskItems(exclusionTaskItems)
    }
  }

  const fetchTasks = async () => {
    return await axios.get(`http://localhost:3000/api/tasks`)
  }

  return (
    <>
      <Button variant="contained" color="warning" onClick={() => {console.log("タスク更新")}} style={{marginRight: "20px"}}>タスク更新</Button>
      { isHidden
        ? <Button variant="contained" onClick={() => {setIsHidden(!isHidden)}}>下層タスク表示</Button>
        : <Button variant="contained" onClick={() => {setIsHidden(!isHidden)}}>下層タスク非表示</Button>
      }

      <Link target={"_blank"} style={{display: "inline-block", marginLeft: "30px"}} href="/tickets">
        <p>チケット一覧へ</p>
      </Link>
      <Button variant="contained" onClick={createNewTask}>タスク追加</Button>
      { taskItems &&
        <Nestable
          items={taskItems}
          renderItem={renderTask}
          onChange={(event) => {
            storeTasks(event.items)
            setTaskItems(event.items)}
          }
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
