import { Button, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import styles from "../css/Task.module.css"
import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {Statuses, TaskTypes} from "@/app/constants/TaskConstants"
import type { Task } from "@/schema/zod";

type Props = {
  seconds: number,
  operatingTaskId: number,
  onSelectOperatingTask: () => void,
  task : Task,
  onDelete: (task: Task) => void
}

const Task = ({
  seconds,
  operatingTaskId,
  onSelectOperatingTask,
  task,
  achievements,
  plans,
  feedbacks,
  checks,
  onDelete,
}: Props) => {
  const [title, setTitle] = useState(task.title)
  const [isParentTask, setIsParentTask] = useState(false)
  const [operatingTime, setOperatingTime] = useState(achievements.operatingTime)
  const [surveyTime, setSurveyTime] = useState(achievements.surveyTime)
  const [isEditing, setIsEditing] = useState(false)
  const [ticketItems, setTicketItems] = useState<any>([])
  const [status, setStatus] = useState(task.status)
  const [runState, setRunState] = useState("survey")
  const [isSurveyTask, setIsSurveyTask] = useState<boolean>(task.isSurveyTask)
  const [type, setType] = useState<number>(task.type)
  const [ticketId, setTicketId] = useState(task.ticketId)
  const [parentId, setParentId] = useState(task.parentId)

  // TODO: ticketsはstoreで状態管理させる
  useEffect(() => {
    const fetchTickets = async () => {
      const {data} = await axios.get("http://localhost:3000/api/tickets")
      console.log(data)
      return data.sort((item) => item.id).reverse()
    }
    fetchTickets().then((reuslt) => {setTicketItems(reuslt)})
  }, [])

  useEffect(() => {
    if(!isEditing) mutationTask() //編集が完了した瞬間にmutationする
  }, [isEditing])

  useEffect(() => {
    mutationTask()
  }, [isSurveyTask])

  useEffect(() => {
    if (operatingTaskId == task.id) {
      if (isSurveyTask) {
        setSurveyTime(surveyTime + 1)
      } else {
        setOperatingTime(operatingTime + 1)
      }
    }
  }, [seconds])

  const switchOperatingTask = () => {
    operatingTaskId == task.id
    ? onSelectOperatingTask(null)
    : onSelectOperatingTask(task.id)
  }

  useEffect(() => {
    if(operatingTime % 1200 === 0 ) { //NOTE:20分ごとに自動保存されるようにする。
      updateTime()
    }
  }, [operatingTime])

  useEffect(() => {
    if(surveyTime % 1200 === 0) { //NOTE:20分ごとに自動保存されるようにする。
      updateTime()
    }
  }, [surveyTime])

  const updateTime = async () => {
    console.log(surveyTime, operatingTime)
    return await axios.patch(`http://localhost:3000/api/tasks/${task.id}/time`,
      {
        surveyTime: surveyTime,
        operatingTime: operatingTime,
      }
    )
  }

  const mutationTask = async () => {
    return await axios.patch(`http://localhost:3000/api/tasks/${task.id}`,
      {
        seconds: seconds,
        isSurveyTask: isSurveyTask,
        status: status,
        type: type,
        title: title,
        parentId: parentId,
        ticketId: ticketId,
        plan: {
          id: plans.id
        },
        achievement: {
          id: achievements.id,
          operatingTime: operatingTime,
          surveyTime: surveyTime,
        },
        check: {
          id: checks.id,
        },
        feedback: {
          id: feedbacks.id,
        }
      }
    )
  }

  return (
    <div className={styles.task} style={isEditing ? {backgroundColor: "white"} : {backgroundColor: "lightgray"}}>
      <FormControl>
        <RadioGroup defaultValue="outlined" name="radio-buttons-group" value={isSurveyTask}>
          <Radio value={true} label="調査中" variant="outlined" onChange={() => {setIsSurveyTask(true);}}/>
          <Radio value={false} label="実装中" variant="outlined" onChange={() => {setIsSurveyTask(false)}}/>
        </RadioGroup>
      </FormControl>
      <div style={{display: "flex", flexDirection: "column"}}>
        {
          isParentTask || (operatingTaskId == task.id
            ? <Button variant="contained" color="error" onClick={switchOperatingTask}>作業終了</Button>
            : <Button variant="contained" color="success" onClick={switchOperatingTask}>作業開始</Button>
          )
        }
        {
          (isEditing
            ? <Button variant="contained" color="info" onClick={() => {setIsEditing(!isEditing)}}>編集完了</Button>
            : <Button variant="contained" color="secondary" onClick={() => {setIsEditing(!isEditing)}}>編集</Button>
          )
        }
        {
          (status != Statuses.Done
            ? <Button variant="contained" color="primary" onClick={() => {setStatus(Statuses.Done)}}>タスク完了</Button>
            : <Button variant="contained" color="inherit" onClick={() => {setStatus(Statuses.Run)}}>実施中に戻す</Button>
          )
        }
        { isEditing && <Button variant="contained" color="error" onClick={() => {onDelete(task)}}>削除</Button>}
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>タイトル</InputLabel>
        <TextField variant="outlined" disabled={!isEditing} value={title} onChange={(event) => {setTitle(event.target.value)}}/>
      </div>
      <div className={styles.operatedTime}>
        <InputLabel>調査時間</InputLabel>
        <p style={{fontSize: "40px", alignItems: "center", margin: "0px"}}>
          {Math.floor(surveyTime/3600)}:{Math.floor(surveyTime/60)}:{surveyTime % 60}
        </p>
      </div>
      <div className={styles.operatedTime}>
        <InputLabel>実働時間</InputLabel>
        <p style={{fontSize: "40px", alignItems: "center", margin: "0px"}}>
          {Math.floor(operatingTime/3600)}:{Math.floor(operatingTime/60)}:{operatingTime % 60}
        </p>
      </div>
      <div className={styles.inputBlock}>
        <InputLabel>チケット</InputLabel>
        <Select disabled={!isEditing} value={ticketId} defaultValue={1} onChange={(e) => {setTicketId(e.target.value)}}>
          {/* TODO: ticketsはstoreで状態管理させる */}
          {ticketItems.map((ticket)=>{
            return ticket.status != Statuses.Run && <MenuItem disabled={!isEditing} key={ticket.id} value={ticket.id}>{ticket.title}</MenuItem>
          })}
        </Select>
      </div>
      <div className={styles.inputBlock}>
        <InputLabel>状況</InputLabel>
        <Select disabled={!isEditing} className={styles.shortInput} value={status} onChange={(event) => {setStatus(event.target.value)}}>
          {_.map(Statuses, (value, key)=>(<MenuItem key={key} value={value}>{key}</MenuItem>))}
        </Select>
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>タスク種別</InputLabel>
        <Select disabled={!isEditing} className={styles.shortInput} value={type} defaultValue={TaskTypes.FirstTask} onChange={(event) => {setType(event.target.value)}}>
          {_.map(TaskTypes, (value, key)=>(<MenuItem key={key} value={value}>{key}</MenuItem>))}
        </Select>
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>初回完了予想時間</InputLabel>
        <OutlinedInput
          type="number"
          sx={{width: "100px"}}
          inputProps={{
            min: 0
          }}
          disabled={!isEditing}
          endAdornment={<InputAdornment position="end">h</InputAdornment>}
        />
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>最終完了予想時間</InputLabel>
        <OutlinedInput
          type="number"
          sx={{width: "100px"}}
          inputProps={{
            min: 0
          }}
          disabled={!isEditing}
          endAdornment={<InputAdornment position="end">h</InputAdornment>}
        />
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>初回予想技術スパイク時間</InputLabel>
        <OutlinedInput
          type="number"
          sx={{width: "100px"}}
          inputProps={{
            min: 0
          }}
          disabled={!isEditing}
          endAdornment={<InputAdornment position="end">h</InputAdornment>}
        />
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>最終予想技術スパイク時間</InputLabel>
        <OutlinedInput
          type="number"
          sx={{width: "100px"}}
          inputProps={{
            min: 0
          }}
          disabled={!isEditing}
          endAdornment={<InputAdornment position="end">h</InputAdornment>}
        />
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>調査内容</InputLabel>
        <TextField disabled={!isEditing} variant="outlined" multiline />
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>完了日</InputLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker label={null} />
        </LocalizationProvider>
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>調査時間</InputLabel>
        <TextField disabled={!isEditing} variant="outlined" multiline />
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>実装時間</InputLabel>
        <TextField disabled={!isEditing} variant="outlined" multiline />
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>結果考察</InputLabel>
        <TextField disabled={!isEditing} variant="outlined" multiline />
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>課題</InputLabel>
        <TextField disabled={!isEditing} variant="outlined" multiline />
      </div>
      <div className={styles.taskColumn}>
        <InputLabel>改善点</InputLabel>
        <TextField disabled={!isEditing} variant="outlined" multiline />
      </div>
    </div>
  );
};

export default Task;
