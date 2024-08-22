let interval: any;
let i = 0;

self.onmessage = ({ data }) => {
  if (data === "start") {
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
      postMessage(0);
    }
  }
};
