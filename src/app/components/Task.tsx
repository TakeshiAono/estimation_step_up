import { Box, Button, FormControl, InputLabel, MenuItem, NativeSelect, Select, TextField } from "@mui/material";
import styles from "../css/Task.module.css"
import { useEffect, useState } from "react";
import axios from "axios";
import _, { round } from "lodash";

interface props {
  tickets: any;
}

const Task = ({seconds}: {seconds: number}) => {
  const [tickets, setTickets] = useState([1,2,3])
  // const [tasks, setTasks] = useState([1,2,3])
  const [isOperatingTask, setIsOperatingTask] = useState(false)
  const [title, setTitle] = useState("")
  const [isParentTask, setIsParentTask] = useState(false)
  const [operatingTime, setOperatingTime] = useState(0)
  const [timer, setTimer] = useState(0)

  // const [tasktypes, setTaskTypes] = useState([1,2,3])

  // setInterval((c) => {
  //   setTimer(timer + 1)
  // }, 1000);
useEffect(() => {
  isOperatingTask && setOperatingTime(operatingTime + 1)
}, [seconds])

  // setOperatingTime(seconds)

  const taskTypes = {
    "初回タスク": 0,
    "調査後タスク": 1,
    "調査後漏れタスク": 2,
    "不明": 3
  }
  const status = {"未着手": 0, "作業中": 1, "完了": 2}

  const getData = async () => {
    const response = await axios.get("/api/tickets/1");
    console.log(response);
    setTickets(response.data[0].title)
  };

  const switchOperatingTask = () => {
    setIsOperatingTask(!isOperatingTask)
  }

  const switchParentTask = () => {
    setIsParentTask(!isParentTask)
  }

  const commonStyles = {
  bgcolor: 'background.paper',
  m: 1,
  border: 1,
  width: '5rem',
  height: '5rem',
};

  return (
    <div className={styles.ticket}>
      {
        isParentTask || (isOperatingTask
          ? <Button variant="contained" color="warning" onClick={switchOperatingTask}>作業を終了する</Button>
          : <Button variant="contained" color="success" onClick={switchOperatingTask}>作業を始める</Button>
        )
      }
      <div className={styles.inputBlock}>
        <InputLabel>チケット番号</InputLabel>
        <Select>
          {tickets.map((ticket)=>(<MenuItem key={ticket} value={ticket}>{ticket}</MenuItem>))}
        </Select>
      </div>
      <div className={styles.inputBlock}>
        <InputLabel>状況</InputLabel>
        <Select className={styles.shortInput} defaultValue={status["未着手"]}>
          {_.map(status, (value, key)=>(<MenuItem key={key} value={value}>{key}</MenuItem>))}
        </Select>
      </div>
      <div className={styles.taskType}>
        <InputLabel>タスク種別</InputLabel>
        <Select className={styles.shortInput} defaultValue={taskTypes["初回タスク"]}>
          {_.map(taskTypes, (value, key)=>(<MenuItem key={key} value={value}>{key}</MenuItem>))}
        </Select>
      </div>
      <div className={styles.taskType}>
        <InputLabel>タイトル</InputLabel>
        <TextField variant="outlined" value={title} onChange={(event) => {setTitle(event.target.value)}}/>
      </div>
      {
        isParentTask
          ? <Button variant="contained" color="error" onClick={switchParentTask}>親タスク解除</Button>
          : <Button variant="contained" color="success" onClick={switchParentTask}>子タスクを追加する</Button>
      }
      {
        isParentTask || (
          <>
            <div className={styles.taskType}>
              <InputLabel>初回完了予想時間(h)</InputLabel>
              {Array(10)}
              <Select className={styles.shortInput}>
              {_.map(_.range(11), (value)=>(<MenuItem key={value} value={value}>{value}</MenuItem>))}
              </Select>
            </div>
            <div className={styles.taskType}>
              <InputLabel>初回予想技術スパイク時間(h)</InputLabel>
              {Array(10)}
              <Select className={styles.shortInput}>
              {_.map(_.range(11), (value)=>(<MenuItem key={value} value={value}>{value}</MenuItem>))}
              </Select>
            </div>
            <div className={styles.taskType}>
              <InputLabel>初回予想技術スパイク時間(h)</InputLabel>
              {Array(10)}
              <Select className={styles.shortInput}>
              {_.map(_.range(11), (value)=>(<MenuItem key={value} value={value}>{value}</MenuItem>))}
              </Select>
            </div>
            <div className={styles.taskType}>
              <InputLabel>調査内容</InputLabel>
              <TextField variant="outlined" multiline />
            </div>
          </>
        )
      }
      <div className={styles.taskType}>
        <InputLabel>実働時間(調査時間を含む)</InputLabel>
        {Math.floor(operatingTime/3600)}:{Math.floor(operatingTime/60)}:{operatingTime % 60}
      </div>
    </div>
  );
};

export default Task;
