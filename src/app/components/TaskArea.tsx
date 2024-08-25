"use client";

import { useEffect, useState } from "react";
import Task from "./Task";
import _ from "lodash";
import Nestable from "react-nestable";
import axios from "axios";
import type { Task as TaskType } from "@/schema/zod";
import Timer from "./Timer";

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
        />
      </>
    );
  };

  useEffect(() => {
    const fetchTaskItems = async () => {
      const { data } = pathParameterTaskId ? await fetchChildTask(pathParameterTaskId) : await fetchTasks()
      return data;
    };

    fetchTaskItems().then((data: TaskType[]) => {
      console.log("取得データ", data);
      const parentTasks = pathParameterTaskId ? data : data.filter((task) => task.parentId === null)
      setTaskItems(parentTasks);
    });
  }, []);

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
    console.log("かえってきた", data)
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

  const fetchTasks = async () => {
    return await axios.get(`http://localhost:3001/api/tasks`);
  };

  const fetchChildTask = async (id: string) => {
    return await axios.get(`http://localhost:3001/api/tasks/${id}`);
  };

  return (
    <>
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
