let interval: any;
let i = 0;

self.onmessage = ({ data }) => {
  if (data === "start") {
    // intervalが既に存在する場合は、セットしないようにする
    if (!interval) {
      interval = setInterval(() => {
        i++;
        postMessage(i);
      }, 1000);
    }
  } else if (data === "stop") {
    if (interval) {
      clearInterval(interval); // インターバルを停止
      interval = undefined; // intervalをリセット
      postMessage("Stopped");
    }
  }
};
