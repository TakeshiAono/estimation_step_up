import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import { Button, InputLabel, Slider, Stack, TextField } from "@mui/material";
// @ts-ignore
import operationEndSound from "./../assets/operation_end.mp3";
import notifySound from "./../assets/notify.mp3";
// @ts-ignore
import restEndSound from "./../assets/rest_end.mp3";
import styles from "../css/Timer.module.css";
import { VirtualWindow } from "@react-libraries/virtual-window";

import VolumeSlider from "./VolumeSlider";

let worker = new Worker(new URL("../../libs/secondsTimer.ts", import.meta.url));

const Timer = ({
  onTimerUpdate,
}: {
  onTimerUpdate: (number: number) => void;
}) => {
  const timer = useRef<any>(null);
  const isInitialRender = useRef(true);
  const initializeOperatingSeconds = 25;
  const initializeRestSeconds = 5;
  const [operatingSeconds, setOperatingSeconds] = useState<number>(
    (Number(localStorage.getItem("inputOperatingMinutes")) ||
      initializeOperatingSeconds) *
      60 -
      (localStorage.getItem("isResting") === "true"
        ? 0
        : Number(localStorage.getItem("sumTime"))),
  );
  const [restSeconds, setRestSeconds] = useState<number>(
    Number(localStorage.getItem("inputRestMinutes") || initializeRestSeconds) *
      60 -
      (localStorage.getItem("isResting") === "true"
        ? Number(localStorage.getItem("sumTime"))
        : 0),
  );
  const [isResting, setIsResting] = useState(
    localStorage.getItem("isResting") === "true",
  );
  const [volume, setVolume] = useState(
    Number(localStorage.getItem("volume")) || 50,
  );
  const [operationSoundPlay] = useSound(operationEndSound, {
    volume: volume / 100,
  });
  const [restSoundPlay] = useSound(restEndSound, { volume: volume / 100 });
  const [notifySoundPlay] = useSound(notifySound, { volume: volume / 100 });
  const [isInputHidden, setIsInputHidden] = useState(false);
  const [sumTime, setSumTime] = useState(
    Number(localStorage.getItem("sumTime")),
  );
  const [isStarting, setIsStarting] = useState(
    localStorage.getItem("isStarting") === "true",
  );
  const [inputOperatingMinutes, setInputOperatingMinutes] = useState(
    Number(localStorage.getItem("inputOperatingMinutes")) ||
      initializeOperatingSeconds,
  );
  const [inputRestMinutes, setInputRestMinutes] = useState(
    Number(localStorage.getItem("inputRestMinutes")) || initializeRestSeconds,
  );

  useEffect(() => {
    isInitialRender.current = false;
    if (isStarting) {
      worker.postMessage("start");
    }
  }, []);

  useEffect(() => {
    if (!isStarting && sumTime >= 0) {
      timer.current = setInterval(() => {
        notifySoundPlay();
      }, 10000);
    } else {
      clearInterval(timer.current);
    }
    worker.postMessage(["stop", sumTime]);
    localStorage.setItem("isStarting", `${isStarting}`);
  }, [isStarting]);

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem(
      "inputOperatingMinutes",
      inputOperatingMinutes.toString(),
    );
  }, [inputOperatingMinutes]);

  useEffect(() => {
    localStorage.setItem("inputRestMinutes", inputRestMinutes.toString());
  }, [inputRestMinutes]);

  worker.onmessage = () => {
    localStorage.setItem("sumTime", Number(sumTime));
    addSum.current();
  };

  const addSum = useRef(() => {
    setSumTime((prevSumTime) => {
      const newSumTime = prevSumTime + 1;
      return newSumTime;
    });
  });

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

  const timerReset = () => {
    timerPause();
    setSumTime(0);
    setTimeout(() => {
      setOperatingSeconds(inputOperatingMinutes * 60);
      setRestSeconds(inputRestMinutes * 60);
    }, 10);
  };

  const timerPause = () => {
    worker.postMessage("stop");
    setIsStarting(false);
  };

  const timerStart = async () => {
    setSumTime(0);
    if (!isStarting) {
      worker.postMessage("start");
      setIsStarting(true);
    }
  };

  const timerSwitch = () => {
    timerReset();
    localStorage.setItem("isResting", `${!isResting}`);
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
        <VolumeSlider volume={volume} onChange={setVolume} />
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
