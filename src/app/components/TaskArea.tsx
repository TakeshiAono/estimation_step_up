"use client";

import { useEffect, useState } from "react";
import Task from "./Task";
import _ from "lodash";
import Nestable from "react-nestable";
import axios from "axios";
import type { Task as TaskType } from "@/schema/zod";
import Timer from "./Timer";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Statuses } from "../constants/TaskConstants";

type Props = {
  createdTopTask: Task;
  pathParameterTaskId?: string;
  isMinimum?: boolean;
}

export default function TaskArea({
  createdTopTask,
  pathParameterTaskId,
  isMinimum
}: Props) {
  const [seconds, setSeconds] = useState(0);
  const [taskItems, setTaskItems] = useState<TaskType[]>([]);
  const [isHidden, setIsHidden] = useState(false);
  const [operatingTaskId, setOperatingTaskId] = useState(null);
  const [ticketItems, setTicketItems] = useState<any>([]);
  const [selectSearchTicketId, setSelectSearchTicketId] = useState<number | null>(localStorage.getItem("selectSearchTicketId"))

  // TODO: ticketsはstoreで状態管理させる
  useEffect(() => {
    const fetchTickets = async () => {
      const { data } = await axios.get("http://localhost:3001/api/tickets");
      console.log(data);
      return data.sort((item) => item.id).reverse();
    };

    fetchTickets().then((reuslt) => {
      setTicketItems(
        () => {
          return reuslt
        }
      );
    });
  }, []);

  useEffect(() => {
    fetchTasksByTicketId(localStorage.getItem("selectSearchTicketId")).then((response: TaskType[]) => {
      console.log("取得データ", response.data);
      const parentTasks = pathParameterTaskId ? response.data : response.data.filter((task) => task.parentId === null)
      setTaskItems(parentTasks);
    });
  }, []);

  useEffect(() => {
    fetchTasksByTicketId(localStorage.getItem("selectSearchTicketId")).then((response: TaskType[]) => {
      console.log("取得データ", response.data);
      const parentTasks = pathParameterTaskId ? response.data : response.data.filter((task) => task.parentId === null)
      setTaskItems(parentTasks);
    });
  }, [selectSearchTicketId])

  const filterTaskItemByTicketId = () => {
    return taskItems.filter(taskItem => taskItem.ticketId === selectSearchTicketId)
  }

  const renderTask = ({ item }: { item: Task }) => {
    return (
      <>
        <Task
          key={item.id}
          seconds={seconds}
          onSelectOperatingTask={setOperatingTaskId}
          operatingTaskId={operatingTaskId}
          task={item}
          achievements={item.achievements[0]}
          plans={item.plans[0]}
          feedbacks={item.feedbacks[0]}
          checks={item.checks[0]}
          onDelete={deleteTask}
          isMinimum={isMinimum}
          onAddTask={addTask}
          onAddTasks={addTasks}
          ticketItems={ticketItems}
        />
      </>
    );
  };

  const fetchTasksByTicketId = async (ticketId: number) => {
    return await axios.get(`http://localhost:3001/api/tasks?ticketId=${ticketId}`);
  };



  useEffect(() => {
    createdTopTask && setTaskItems([createdTopTask, ...taskItems]);
  }, [createdTopTask]);

  const addTask = async (addToTaskId: number) => {
    const { data } = await axios.post(`http://localhost:3001/api/tasks/create/child/${addToTaskId}`,)
    const positions = _getTargetTaskPositionBFS(taskItems, addToTaskId);
    positions.reduce((accumulator, currentValue, index) => {
      if (index == positions.length -1) {
        accumulator[currentValue].children.unshift(data)
        setTaskItems([...taskItems]);
        return;
      }

      return accumulator[currentValue].children;
    }, taskItems);
  };

  const addTasks = async (addToTaskId: number, taskTitles: string[]) => {
    const { data } = await axios.post(`http://localhost:3001/api/tasks/${addToTaskId}/children/bulk`, taskTitles)
    const positions = _getTargetTaskPositionBFS(taskItems, addToTaskId);
    data.forEach((task: Task) => {
      positions.reduce((accumulator, currentValue, index) => {
        if (index == positions.length -1) {
          accumulator[currentValue].children.unshift(task)
          setTaskItems([...taskItems]);
          return;
        }
  
        return accumulator[currentValue].children;
      }, taskItems);
    })
  };

  const _getTargetTaskPositionBFS = (
    taskItems: TaskType[],
    taskId: number
  ): number[] => {
    let originNodeAndPosition: [Task, number[]] = [];
    let nextNodeAndPosition: [Task, number[]] = [];

    originNodeAndPosition = taskItems.map((item, index) => [item, [index]]);
    let catchNodePosition = null;

    while (originNodeAndPosition.length > 0) {
      catchNodePosition = originNodeAndPosition.find(
        (nodeInfo) => nodeInfo[0].id == taskId
      )?.[1]; // 検索実行
      if (catchNodePosition) break; // 検索引っかかったらwhileを抜ける

      // キューから出して別の配列に保存
      while (originNodeAndPosition.length > 0) {
        const target = originNodeAndPosition.shift();
        const tasks = target[0].children;
        tasks.forEach((task, index) => {
          nextNodeAndPosition.push([task, [...target[1], index]]);
        });
      }

      originNodeAndPosition = nextNodeAndPosition;
      nextNodeAndPosition = [];
    }
    return catchNodePosition;
  };

  const storeTasks = async (items) => {
    return await axios.put<TaskType>(
      `http://localhost:3001/api/tasks/bulk`,
      JSON.stringify(items)
    );
  };

  const deleteTask = async ({ id }: { id: number }) => {
    const response = await axios.delete(
      `http://localhost:3001/api/tasks/${id}`
    );
    if (response.status === 200) {
      const exclusionTaskItems = _.filter(
        taskItems,
        (taskItem) => taskItem.id !== id
      );
      setTaskItems(exclusionTaskItems);
    }
  };

  const fetchAllTasks = async () => {
    return await axios.get(`http://localhost:3001/api/tasks`);
  };

  const fetchChildTask = async (id: string) => {
    return await axios.get(`http://localhost:3001/api/tasks/${id}`);
  };

  return (
    <>
      <div style={{marginTop: "30px"}}>
        <FormControl sx={{width: "200px"}}>
          <InputLabel id="search-tickets-label">チケット検索</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue={selectSearchTicketId　|| "unclassified"}
            label="ticket"
            onChange={(e) => {
              localStorage.setItem("selectSearchTicketId", e.target.value)
              setSelectSearchTicketId(e.target.value)
            }}
          >
            <MenuItem
              key={null}
              value={"unclassified"}
            >
              未分類
            </MenuItem>
            {/* TODO: ticketsはstoreで状態管理させる */}
            {ticketItems.map((ticket) => {
              return (
                ticket.status != Statuses.Done && (
                  <MenuItem
                    key={ticket.id}
                    value={ticket.id}
                  >
                    {ticket.title}
                  </MenuItem>
                )
              );
            })}
          </Select>
        </FormControl>
      </div>
      {taskItems && (
        <Nestable
          items={taskItems}
          renderItem={renderTask}
          onChange={(event) => {
            storeTasks(event.items);
            setTaskItems(event.items);
          }}
          disableCollapse={true}
          disableDrag={false}
          collapsed={isHidden}
        />
      )}
      <Timer
        onTimerUpdate={(totalSeconds: number) => {
          setSeconds(totalSeconds);
        }}
      />
    </>
  );
}
