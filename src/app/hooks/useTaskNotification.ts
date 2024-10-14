import { useEffect, useRef } from "react";
import { Task } from "@prisma/client";
import useSound from "use-sound";
import notifySound from "../assets/notify2.mp3";

const useTaskNotification = (
  task: Task,
  doneTimeRate: number,
  progressRate: number,
) => {
  const isMiddleNotified = useRef(false);
  const isDeadlineNotified = useRef(false);
  const [notifySoundPlay] = useSound(notifySound, { volume: 100 / 100 });

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    if (!isMiddleNotified.current && doneTimeRate == progressRate) {
      isMiddleNotified.current = true;
      new Notification("❗️HurryUp", {
        body: task.title ?? "",
      }).onshow = () => {
        notifySoundPlay();
      };
    }
    if (!isDeadlineNotified.current && doneTimeRate == 100) {
      new Notification("🟡予想完了時間オーバー", {
        body: task.title ?? "",
      }).onshow = () => {
        notifySoundPlay();
      };
      isDeadlineNotified.current = true;
    }
  }, [doneTimeRate, task]);
};

export default useTaskNotification;
