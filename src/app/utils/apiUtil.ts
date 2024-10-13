import { Task, Ticket } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";

export async function fetchTickets() {
  const { data } = await axios.get<Ticket[]>(
    "http://localhost:3001/api/tickets",
  );
  return data.sort((item) => item.id).reverse();
}

export async function fetchTasks() {
  return (await axios.get<Task[]>(`http://localhost:3001/api/tasks`)).data;
}

export async function fetchBusinessTermSetting() {
  try {
    const { data } = await axios.get<{
      startBusinessTime: string;
      endBusinessTime: string;
    }>(`http://localhost:3001/api/settings/dummy_id`);
    return [
      dayjs(data.startBusinessTime).format(),
      dayjs(data.endBusinessTime).format(),
    ];
  } catch (error) {
    console.log("Error", error);
    return [];
  }
}

export async function saveTaskTerm(task: Task, taskTermId: string) {
  // FIXME: TaskテーブルにoperatingTermJsonみたいな[{operatingDate: 日付, start: 100, end: 200},{operatingDate: 日付, start: 300, end: 400}]カラムを作り配列形式で保存する。そのデータをchartの中のデータを作成する
  await axios.post(`http://localhost:3001/api/tasks/${task.id}/term`, {
    taskTermId: taskTermId,
  });
  console.log("Save Start Time Complete");
}

export async function mutateTimeAndOperatingTime(
  task: Task,
  surveyTime: number,
  operatingTime: number,
  pastSurveyTime: number,
  pastOperatingTime: number,
) {
  return await axios.patch(`http://localhost:3001/api/tasks/${task.id}/time`, {
    // NOTE: operatingTime % 60 === 1 || surveyTime % 60 === 1の条件で保存されると毎回表示されるたびにtask一覧が表示されるたびにpatchリクエストが飛んでしまうので+1でずらす
    surveyTime: surveyTime - pastSurveyTime,
    operatingTime: operatingTime - pastOperatingTime,
  });
}

export async function createTimeAndOperatingTime(
  task: Task,
  surveyTime: number,
  operatingTime: number,
  pastSurveyTime: number,
  pastOperatingTime: number,
) {
  return await axios.post(`http://localhost:3001/api/tasks/${task.id}/time`, {
    // NOTE: operatingTime % 60 === 1 || surveyTime % 60 === 1の条件で保存されると毎回表示されるたびにtask一覧が表示されるたびにpatchリクエストが飛んでしまうので+1でずらす
    surveyTime: surveyTime - pastSurveyTime,
    operatingTime: operatingTime - pastOperatingTime,
  });
}
