"use client";

import { useState } from "react";
import Task from "./components/Task";
import Timer from "./components/Timer";

export default function Home() {
  const [seconds, setSeconds] = useState(0);

  return (
    <>
      <Task seconds={seconds} />
      <Timer
        onTimerUpdate={(totalSeconds: number) => {
          setSeconds(totalSeconds);
        }}
      />
    </>
  );
}
