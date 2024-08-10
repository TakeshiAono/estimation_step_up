import { useEffect, useState } from "react"
import { useTimer } from "react-timer-hook";
import useSound from "use-sound";
import {Button, InputLabel, TextField } from "@mui/material";
// @ts-ignore
import operationEndSound from './../assets/operation_end.mp3';
// @ts-ignore
import restEndSound from './../assets/rest_end.mp3';
import styles from "../css/Timer.module.css"
import { VirtualWindow } from "@react-libraries/virtual-window";

const Timer = ({onTimerUpdate}: {onTimerUpdate: (number: number) => void}) => {
  const [operatingMinutes, setOperatingMinutes] = useState<number>(25)
  const [restMinutes, setRestMinutes] = useState<number>(5)
  const [isResting, setIsResting] = useState(false)
  const [operationSoundPlay] = useSound(operationEndSound, {volume: 0.3});
  const [restSoundPlay] = useSound(restEndSound, {volume: 1});
  const [isInputHidden, setIsInputHidden] = useState(false)

  const settingDateObject = (min: number) => {
    const date = new Date()
    date.setSeconds(date.getSeconds() + min * 60)
    return date
  }

  const soundPlay = () => {
    isResting
      ? (() => {
        restSoundPlay()
        restart(settingDateObject(restMinutes), false)
        })()
      : (() => {
        operationSoundPlay()
        restart(settingDateObject(operatingMinutes), false)
      })()
  }

  const {
    totalSeconds,
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: isResting ? settingDateObject(restMinutes) : settingDateObject(operatingMinutes),
    onExpire: soundPlay
  });

  useEffect(() => {
    pause()
  }, [])

  useEffect(() => {
    !isResting && restart(settingDateObject(operatingMinutes), false)
  }, [operatingMinutes])

  useEffect(() => {
    isResting && restart(settingDateObject(restMinutes), false)
  }, [restMinutes])

  useEffect(() => {
    isResting || onTimerUpdate(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    isResting ? restart(settingDateObject(restMinutes), false) : restart(settingDateObject(operatingMinutes), false)
  }, [isResting])

  useEffect(() => {
  }, [operatingMinutes])

  const switchSetting = async () => {
    setIsResting(!isResting)
  }

  const selectedRestart = (isAutoStart: boolean) => {
    isResting ? restart(settingDateObject(restMinutes), isAutoStart) : restart(settingDateObject(operatingMinutes), isAutoStart)
  }

  return (
    <VirtualWindow title="Timer" width={300} height={400} titleButtons={{max: false, min: false, close: false}}>
      <div className={isResting ? styles.restTimer : styles.operatingTimer}>
        <h1>ポモドーロタイマー </h1>
        <div style={{fontSize: '100px'}}>
          <span>{minutes}</span>:<span>{seconds}</span>
        </div>
        <Button sx={{marginBottom: "10px"}} variant="contained" size={"small"} color="inherit" onClick={() => {setIsInputHidden(!isInputHidden)}}>Hidden</Button>
        { isInputHidden ||
          <div style={{backgroundColor: "white", padding:"20px"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <InputLabel>作業時間</InputLabel>
              <TextField type="number" value={operatingMinutes} color="primary" onChange={(event) => {setOperatingMinutes(Number(event.target.value))}}/>
            </div>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <InputLabel>休憩時間</InputLabel>
              <TextField type="number" value={restMinutes} color="primary" onChange={(event) => {setRestMinutes(Number(event.target.value))}}/>
            </div>
          </div>
        }
        <div style={{backgroundColor: "white", display: "flex", justifyContent: "space-around", padding: "20px"}}>
          <Button variant="contained" size={"small"} onClick={start}>Start</Button>
          <Button variant="contained" size={"small"} color="error" onClick={pause}>Pause</Button>
          <Button variant="contained" size={"small"} color="success" onClick={() => {
            switchSetting()
            selectedRestart(false)
          }}>Switching</Button>
          <Button variant="contained" size={"small"} color="secondary" onClick={() => selectedRestart(false)}>Reset</Button>
        </div>
      </div>
    </VirtualWindow>
  )
}

export default Timer
