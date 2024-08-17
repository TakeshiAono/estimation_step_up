import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import { Button, InputLabel, TextField } from "@mui/material";
// @ts-ignore
import operationEndSound from "./../assets/operation_end.mp3";
// @ts-ignore
import restEndSound from "./../assets/rest_end.mp3";
import styles from "../css/Timer.module.css";
import { VirtualWindow } from "@react-libraries/virtual-window";

var worker = new Worker(new URL("../../libs/secondsTimer.ts", import.meta.url));

const Timer = ({
  onTimerUpdate,
}: {
  onTimerUpdate: (number: number) => void;
}) => {
  const [operatingSeconds, setOperatingSeconds] = useState<number>(25 * 60);
  const [restSeconds, setRestSeconds] = useState<number>(5 * 60);
  const [isResting, setIsResting] = useState(false);
  const [operationSoundPlay] = useSound(operationEndSound, { volume: 0.3 });
  const [restSoundPlay] = useSound(restEndSound, { volume: 1 });
  const [isInputHidden, setIsInputHidden] = useState(false);
  const [sumTime, setSumTime] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [inputOperatingMinutes, setInputOperatingMinutes] = useState(25);
  const [inputRestMinutes, setInputRestMinutes] = useState(5);

  useEffect(() => {
    isResting || onTimerUpdate(sumTime);
    if (sumTime != 0) {
      isResting
        ? setRestSeconds((prev) => prev - 1)
        : setOperatingSeconds((prev) => prev - 1);
    }
    if (restSeconds === 0 || operatingSeconds === 0) {
      soundPlay();
      timerReset();
    }
  }, [sumTime]);

  const addSum = useRef(() => {
    setSumTime((prevSumTime) => {
      const newSumTime = prevSumTime + 1;
      return newSumTime;
    });
  });

  worker.onmessage = (e) => {
    addSum.current();
  };

  const timerStart = async () => {
    if (!isStarting) {
      setIsStarting(true);
      worker.postMessage("start");
    }
  };

  const timerPause = () => {
    worker.postMessage("stop");
    setIsStarting(false);
  };

  const timerReset = () => {
    timerPause();
    setTimeout(() => {
      setOperatingSeconds(inputOperatingMinutes * 60);
      setRestSeconds(inputRestMinutes * 60);
    }, 10);
  };

  const timerSwitch = () => {
    timerReset();
    setIsResting(!isResting);
  };

  const soundPlay = () => {
    isResting
      ? (() => {
          restSoundPlay();
          timerReset();
        })()
      : (() => {
          operationSoundPlay();
          timerReset();
        })();
  };

  return (
    <VirtualWindow
      title="Timer"
      x={700}
      y={300}
      width={300}
      height={400}
      titleButtons={{ max: false, min: false, close: false }}
    >
      <div className={isResting ? styles.restTimer : styles.operatingTimer}>
        <h1>ポモドーロタイマー </h1>
        <div style={{ fontSize: "100px" }}>
          {isResting ? (
            <>
              <span>{Math.floor(restSeconds / 60)}</span>:
              <span>{restSeconds % 60}</span>
            </>
          ) : (
            <>
              <span>{Math.floor(operatingSeconds / 60)}</span>:
              <span>{operatingSeconds % 60}</span>
            </>
          )}
        </div>
        <Button
          sx={{ marginBottom: "10px" }}
          variant="contained"
          size={"small"}
          color="inherit"
          onClick={() => {
            setIsInputHidden(!isInputHidden);
          }}
        >
          Hidden
        </Button>
        {isInputHidden || (
          <div style={{ backgroundColor: "white", padding: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InputLabel>作業時間(分)</InputLabel>
              <TextField
                type="number"
                value={inputOperatingMinutes}
                color="primary"
                onChange={(event) => {
                  setInputOperatingMinutes(Number(event.target.value));
                  setOperatingSeconds(Number(event.target.value) * 60);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InputLabel>休憩時間(分)</InputLabel>
              <TextField
                type="number"
                value={inputRestMinutes}
                color="primary"
                onChange={(event) => {
                  setInputRestMinutes(Number(event.target.value));
                  setRestSeconds(Number(event.target.value) * 60);
                }}
              />
            </div>
          </div>
        )}
        <div
          style={{
            backgroundColor: "white",
            display: "flex",
            justifyContent: "space-around",
            padding: "20px",
          }}
        >
          <Button
            variant="contained"
            size={"small"}
            onClick={() => {
              timerStart();
            }}
          >
            Start
          </Button>
          <Button
            variant="contained"
            size={"small"}
            color="error"
            onClick={() => {
              timerPause();
            }}
          >
            Pause
          </Button>
          <Button
            variant="contained"
            size={"small"}
            color="success"
            onClick={timerSwitch}
          >
            Switching
          </Button>
          <Button
            variant="contained"
            size={"small"}
            color="secondary"
            onClick={timerReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </VirtualWindow>
  );
};

export default Timer;
