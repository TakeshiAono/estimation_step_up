"use client";

import { useEffect, useRef, useState } from "react";
import Task from "./Task";
import _ from "lodash";
import Nestable from "react-nestable";
import axios from "axios";
import type { Task as TaskType } from "@/schema/zod";
import Timer from "./Timer";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Statuses } from "../constants/TaskConstants";
import TimeBarChart, { OperatingTaskMinutesMaps } from "./TimeBarChart";
import dayjs from "dayjs";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { fetchAllTickets, getTickets } from "../stores/ticketSlice";
import { useSelector } from "react-redux";
import { getAllTasks } from "../stores/taskSlice";
import { deleteTask } from "../utils/apiUtil";

type Props = {
  addTopTask: TaskType | null;
  pathParameterTaskId?: string;
  isMinimumDisplay?: boolean;
};

export default function TaskArea({
  addTopTask,
  pathParameterTaskId,
  isMinimumDisplay,
}: Props) {
  const [seconds, setSeconds] = useState(0);
  const [taskItems, setTaskItems] = useState<TaskType[]>([]);
  const tasks = useSelector(getAllTasks);
  const [isHidden, setIsHidden] = useState(false);
  const [operatingTaskId, setOperatingTaskId] = useState(null);
  const ticketItems = useSelector(getTickets);
  const [selectSearchTicketId, setSelectSearchTicketId] = useState<
    number | null
  >(localStorage.getItem("selectSearchTicketId"));

  const [operatingTaskMinutesMaps, setOperatingTaskMinutesMaps] =
    useState<OperatingTaskMinutesMaps>([]);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (tasks) {
      getTaskTermInfos();
    }
  }, [tasks]);

  useEffect(() => {
    dispatch(fetchAllTickets());

    // TODO: パスパラメータがある時とない時のifが複数箇所に記載されているため別フックまたはコンポーネントにまとめる
    if (!pathParameterTaskId) {
      fetchTasksByTicketId(localStorage.getItem("selectSearchTicketId")).then(
        (response: TaskType[]) => {
          const parentTasks = pathParameterTaskId
            ? response.data
            : response.data.filter((task) => task.parentId === null);
          setTaskItems(parentTasks);
        },
      );
    } else {
      fetchChildTask(pathParameterTaskId).then((response: TaskType[]) => {
        const parentTasks = pathParameterTaskId
          ? response.data
          : response.data.filter((task) => task.parentId === null);
        setTaskItems(parentTasks);
      });
    }
  }, []);

  useEffect(() => {
    // TODO: パスパラメータがある時とない時のifが複数箇所に記載されているため別フックまたはコンポーネントにまとめる
    if (!pathParameterTaskId) {
      fetchTasksByTicketId(localStorage.getItem("selectSearchTicketId")).then(
        (response: TaskType[]) => {
          const parentTasks = pathParameterTaskId
            ? response.data
            : response.data.filter((task) => task.parentId === null);
          setTaskItems(parentTasks);
        },
      );
    }
  }, [selectSearchTicketId]);

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
          onDelete={deleteTaskById}
          isMinimum={isMinimumDisplay}
          onAddTask={addTask}
          onAddTasks={addTasks}
          ticketItems={ticketItems}
        />
      </>
    );
  };

  const fetchTasksByTicketId = async (ticketId: number) => {
    return await axios.get(
      `http://localhost:3001/api/tasks?ticketId=${ticketId}`,
    );
  };

  useEffect(() => {
    addTopTask && setTaskItems([addTopTask, ...taskItems]);
  }, [addTopTask]);

  const addTask = async (addToTaskId: number) => {
    const { data } = await axios.post(
      `http://localhost:3001/api/tasks/create/child/${addToTaskId}`,
    );
    const positions = _getTargetTaskPositionBFS(taskItems, addToTaskId);
    positions.reduce((accumulator, currentValue, index) => {
      if (index == positions.length - 1) {
        accumulator[currentValue].children.unshift(data);
        setTaskItems([...taskItems]);
        return;
      }

      return accumulator[currentValue].children;
    }, taskItems);
  };

  const addTasks = async (addToTaskId: number, taskTitles: string[]) => {
    const { data } = await axios.post(
      `http://localhost:3001/api/tasks/${addToTaskId}/children/bulk`,
      taskTitles,
    );
    const positions = _getTargetTaskPositionBFS(taskItems, addToTaskId);
    data.forEach((task: Task) => {
      positions.reduce((accumulator, currentValue, index) => {
        if (index == positions.length - 1) {
          accumulator[currentValue].children.unshift(task);
          setTaskItems([...taskItems]);
          return;
        }

        return accumulator[currentValue].children;
      }, taskItems);
    });
  };

  const _getTargetTaskPositionBFS = (
    taskItems: TaskType[],
    taskId: number,
  ): number[] => {
    let originNodeAndPosition: [Task, number[]] = [];
    let nextNodeAndPosition: [Task, number[]] = [];

    originNodeAndPosition = taskItems.map((item, index) => [item, [index]]);
    let catchNodePosition = null;

    while (originNodeAndPosition.length > 0) {
      catchNodePosition = originNodeAndPosition.find(
        (nodeInfo) => nodeInfo[0].id == taskId,
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
      JSON.stringify(items),
    );
  };

  const deleteTaskById = async ({ id }: { id: number }) => {
    const response = await deleteTask(id);
    if (response.status === 200) {
      const exclusionTaskItems = _.filter(
        taskItems,
        (taskItem) => taskItem.id !== id,
      );
      setTaskItems(exclusionTaskItems);
    }
  };

  const fetchChildTask = async (id: string) => {
    return await axios.get(`http://localhost:3001/api/tasks/${id}`);
  };

  const getTaskTermInfos = async () => {
    setOperatingTaskMinutesMaps(
      _.flatten(
        _.compact(
          tasks.map((task) => {
            const extractedTodayTermsByTask =
              task.operatedTermsJsonForTimeBarChart?.filter((term, index) => {
                return dayjs(term.start).isSame(dayjs(), "day");
              });

            let test = null;
            if (extractedTodayTermsByTask?.length > 0) {
              test = extractedTodayTermsByTask.map((term) => {
                return {
                  taskName: task.title,
                  start: dayjs(term.start).diff(
                    dayjs().startOf("day"),
                    "minutes",
                  ),
                  end: dayjs(term.end).diff(dayjs().startOf("day"), "minutes"),
                  color: term.color,
                  jumpUrl: `http://localhost:3001/tasks/${task.id}`,
                };
              });
            }
            return test;
          }),
        ),
      ),
    );
  };

  return (
    <>
      {!!pathParameterTaskId || (
        <div
          style={{
            width: "auto",
            paddingTop: "auto",
            paddingBottom: "20px",
            height: "auto",
            marginTop: "30px",
            backgroundColor: "white",
            position: "sticky",
            top: "50px",
            opacity: "100%",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <FormControl sx={{ width: "300px", marginTop: "20px" }}>
            <InputLabel id="search-tickets-label">チケット検索</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={selectSearchTicketId || "unclassified"}
              label="ticket"
              onChange={(e) => {
                localStorage.setItem("selectSearchTicketId", e.target.value);
                setSelectSearchTicketId(e.target.value);
              }}
            >
              <MenuItem key={null} value={"unclassified"}>
                未分類
              </MenuItem>
              {/* TODO: ticketsはstoreで状態管理させる */}
              {ticketItems.map((ticket) => {
                return (
                  ticket.status != Statuses.Done && (
                    <MenuItem key={ticket.id} value={ticket.id}>
                      {ticket.title}
                    </MenuItem>
                  )
                );
              })}
            </Select>
          </FormControl>
          <div>
            <TimeBarChart
              width={800}
              operatingTaskMinutesMaps={operatingTaskMinutesMaps}
            />
          </div>
        </div>
      )}
      {taskItems && (
        <Nestable
          items={taskItems}
          renderItem={renderTask}
          onChange={(event) => {
            storeTasks(event.items);
            setTaskItems(event.items);
          }}
          disableCollapse={true}
          disableDrag={true}
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
