import { Alert } from "@mui/material";

type Props = {
  isSurveyTerm: boolean;
  isPredictionRequiredTimeOfFirst: boolean;
  isSelectedTicket: boolean;
  // leakTaskExist: boolean;
};

const TaskOperationMessage = ({
  isSurveyTerm,
  isPredictionRequiredTimeOfFirst,
  isSelectedTicket,
}: Props) => {
  const MessageMap = {
    emptyPredictionSurveyTimeOfFirst: {
      message: "初回完了予想時間が未入力です。",
      messageType: "warning",
      display: true,
    },
    notSelectedTicket: {
      message: "チケットが選択されていません。",
      messageType: "warning",
      display: true,
    },
    leakTaskNotify: {
      message:
        "調査漏れがあれば子タスクを追加し、その子タスクのタスク種別をリークタスクにしてください",
      messageType: "info",
      display: true,
    },
    noAlert: {
      message: "",
      messageType: "",
      display: false,
    },
  };

  const selectDisplayContent = (): {
    message: string;
    messageType: "success" | "info" | "warning" | "error";
    display: boolean;
  } => {
    // if (!isSelectedTicket) {
    //   return MessageMap.notSelectedTicket;
    // }

    if (isSurveyTerm) {
      if (!isPredictionRequiredTimeOfFirst) {
        return MessageMap.emptyPredictionSurveyTimeOfFirst;
      } else {
        return MessageMap.leakTaskNotify;
      }
    } else {
      return MessageMap.leakTaskNotify;
    }
  };

  return (
    <>
      {selectDisplayContent().display && (
        <Alert
          severity={selectDisplayContent().messageType}
          sx={{ width: "fit-content", marginBottom: "10px" }}
        >
          <span>{selectDisplayContent().message}</span>
        </Alert>
      )}
    </>
  );
};

export default TaskOperationMessage;
