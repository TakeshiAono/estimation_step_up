"use client";

import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import Link from "next/link";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import dayjsBusinessTime from "dayjs-business-time";
import axios from "axios";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import TicketModal from "../components/TicketModal";
import { Statuses } from "../constants/TaskConstants";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import {
  fetchAllTasks,
  getTasksByTicket,
  setTasks,
} from "../features/taskSlice";

type Props = {
  holidayList: string[];
  startBusinessTimeProp: string;
  endBusinessTimeProp: string;
  convertTickets: any;
  tasks: any;
};

export default function TicketView({
  holidayList,
  startBusinessTimeProp,
  endBusinessTimeProp,
  convertTickets,
  tasks,
}: Props) {
  dayjs.extend(dayjsBusinessTime);
  // 祝日をセット
  dayjs.updateLocale("en", {
    holidays: holidayList,
    holidayFormat: "YYYY/MM/DD",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditTicket, setIsEditTicket] = useState(false);
  const [status, setStatus] = useState("NotYet");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const [ticketItems, setTicketItems] = useState<any>(convertTickets);
  const [editTicketItem, setEditTicketItem] = useState<any>([]);
  const [isBusinessTimeModalOpen, setIsBusinessTimeModalOpen] =
    useState<boolean>(false);
  const [startBusinessTime, setStartBusinessTime] = useState<Dayjs>(
    dayjs(startBusinessTimeProp),
  );
  const [endBusinessTime, setEndBusinessTime] = useState<Dayjs>(
    dayjs(endBusinessTimeProp),
  );

  const inputStartBusinessTime = useRef<Dayjs | null>(null);
  const inputEndBusinessTime = useRef<Dayjs | null>(null);

  const tasksByTicket = useSelector(getTasksByTicket);
  const dispatch = useDispatch();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    dispatch(setTasks(tasks));
  }, []);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteTicket = async (ticketId: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/tickets/${ticketId}`);
      console.log(ticketItems);
      setTicketItems((items) => items.filter((item) => item.id != ticketId));
    } catch (error) {
      console.log("Error", error);
    }
  };

  const editTicket = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/tickets/${editTicketItem.id}`,
        { ...editTicketItem, status: Statuses[editTicketItem.status] },
      );
      setTicketItems((items) =>
        items.map((item) => {
          if (item.id == editTicketItem.id) {
            return editTicketItem;
          } else {
            return item;
          }
        }),
      );
    } catch (error) {
      console.log("Error", error);
    }
  };

  const storeSetting = async (
    startBusinessTime: Dayjs,
    endBusinessTime: Dayjs,
  ) => {
    try {
      console.log(
        startBusinessTime.toISOString(),
        endBusinessTime.toISOString(),
      );
      const { data } = await axios.put<{
        startBusinessTime: string;
        endBusinessTime: string;
      }>(`http://localhost:3001/api/settings/dummy`, {
        startBusinessTime: startBusinessTime.toISOString(),
        endBusinessTime: endBusinessTime.toISOString(),
      });
      setStartBusinessTime(dayjs(data.startBusinessTime));
      setEndBusinessTime(dayjs(data.endBusinessTime));
    } catch (error) {
      console.log("Error", error);
    }
  };

  const TicketStatuses = {
    NotYet: 0,
    Run: 1,
    Done: 2,
  };

  interface Column {
    id: "id" | "title" | "url" | "numberOfTask" | "totalTime" | "status";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
  }

  const columns: readonly Column[] = [
    { id: "id", label: "TicketID", minWidth: 20 },
    { id: "status", label: "状況", minWidth: 50 },
    { id: "title", label: "title", minWidth: 50 },
    { id: "url", label: "URL", minWidth: 100 },
    { id: "numberOfTask", label: "タスク数", minWidth: 20 },
    { id: "totalTime", label: "合計所要時間", minWidth: 20 },
    { id: "estimatedDoneDate", label: "完了予想日", minWidth: 20 },
  ];

  function createData(
    id: string,
    status: string,
    title: string,
    url: number,
    deadline: string,
    numberOfTask: number,
    totalTime: number,
  ) {
    return { id, status, title, url, deadline, numberOfTask, totalTime };
  }

  const createTicket = async () => {
    const foundItem = _.maxBy(ticketItems, (item) => Number(item.id));

    let nextId;
    if (foundItem) {
      nextId = Number(foundItem.id) + 1;
    } else {
      nextId = 1;
    }

    try {
      await axios.post(
        `http://localhost:3001/api/tickets/create`,
        JSON.stringify({
          title: title,
          status: TicketStatuses[status],
          url: url,
          deadline: deadline,
        }),
      );
      const newItem = createData(
        nextId.toString(),
        TicketStatuses[status],
        title,
        url,
        deadline,
        0,
        0,
      );
      setTicketItems([newItem, ...ticketItems]);
    } catch (e) {
      console.log("Error:", e);
    } finally {
      closeModal();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const changeStatusId = (event) => {
    setStatus(event.target.value);
  };

  const estimatedDoneDate = (
    id: number,
    isExcludeHoliday = true,
  ): Dayjs | undefined => {
    if (!(startBusinessTime && endBusinessTime)) return;

    const sumHour = tasksByTicket[id]
      ?.map((task) => {
        if (task.status == Statuses.Done) {
          return 0;
        } else {
          return task.plans[0].predictionRequiredTimeOfFirst;
        }
      })
      .reduce((prev, next) => prev + next);

    // NOTE: 1日8h作業を基準とする
    const restTime = 1; // 1時間の休憩時間
    const activeTime = endBusinessTime.diff(startBusinessTime, "h");
    const addDay = Math.floor(sumHour / (activeTime - restTime));
    const addHour = sumHour % (activeTime - restTime);

    let doneDate = null;
    // TODO:それぞれ休憩時間分1hずれてそうな感じがする
    if (dayjs() < endBusinessTime && dayjs() < startBusinessTime) {
      // NOTE: 業務開始前
      doneDate = dayjs()
        .add(addDay, "d")
        .set("h", startBusinessTime.get("h"))
        .set("m", startBusinessTime.get("m"))
        .add(addHour, "h");
    } else if (dayjs() > startBusinessTime && dayjs() < endBusinessTime) {
      // NOTE: 業務中
      const endOverHour = Math.abs(dayjs()
        .add(addHour, "h")
        .diff(dayjs().set("h", endBusinessTime.get("h")), "h"));
      if (endOverHour > 0) {
        doneDate = dayjs()
          .add(addDay + 1, "d")
          .set("h", startBusinessTime.get("h"))
          .add(endOverHour, "h");
      } else {
        doneDate = dayjs().add(addDay, "d").add(addHour, "h");
      }
    } else {
      // NOTE: 業務終了後
      doneDate = dayjs()
        .add(addDay + 1, "d")
        .set("h", startBusinessTime.get("h"))
        .set("m", startBusinessTime.get("m"))
        .add(addHour, "h");
    }

    if (isExcludeHoliday) {
      return _.last(holidaySkipDateListAtTerm(doneDate));
    } else {
      return doneDate;
    }
  };

  const isHoliday = (date: Dayjs) => {
    const targetDate = dayjs(date);
    if (targetDate.day() == 0 || targetDate.day() == 6) {
      return true;
    }

    // NOTE: 祝日の判定
    return targetDate.isHoliday(); // trueになります
  };

  const holidaySkipDateListAtTerm = (endDate: Dayjs, startDate = dayjs()) => {
    let tempList: Dayjs[] = [];
    const throwDayList: Dayjs[] = _.range(endDate.diff(startDate, "d") + 1).map(
      (__, index) => {
        let candidateDay;
        if (index === 0) {
          candidateDay = startDate;
        } else {
          const lastDay = _.last(tempList) as Dayjs;
          candidateDay = lastDay.add(1, "d");
        }

        while (isHoliday(candidateDay)) {
          candidateDay = candidateDay.add(1, "d");
        }
        tempList.push(candidateDay);
        return candidateDay;
      },
    );
    return throwDayList;
  };

  return (
    <>
      <Button variant="contained" onClick={openModal}>
        チケット作成
      </Button>
      <Link href="/tasks">
        <p>タスク一覧へ</p>
      </Link>
      <div style={{ display: "flex", alignItems: "center" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            disabled={true}
            label="業務開始時間"
            format="HH:mm"
            ampm={false}
            value={startBusinessTime}
          />
          <TimePicker
            disabled={true}
            label="業務終了時間"
            format="HH:mm"
            ampm={false}
            value={endBusinessTime}
          />
        </LocalizationProvider>
        <div style={{ marginLeft: 20 }}>
          <Button
            variant="contained"
            onClick={() => {
              setIsBusinessTimeModalOpen(true);
            }}
          >
            業務時間を設定する
          </Button>
        </div>
      </div>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow key={"header"}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell key={"deadline"}>デッドライン</TableCell>
              <TableCell key={"button-area1"}></TableCell>
              <TableCell key={"button-area2"}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      // return (
                      switch (column.label) {
                        case "URL":
                          return (
                            <TableCell key={row.id + "column1"}>
                              <Link href={value} target="_blank">
                                {value}
                              </Link>
                            </TableCell>
                          );
                        case "完了予想日":
                          return (
                            <TableCell key={row.id + "column2"}>
                              {/* TODO: チケットごとに休日を含むか含まないかを選択したい */}
                              {estimatedDoneDate(row.id, true)?.format(
                                "YYYY/MM/DD(ddd)",
                              )}
                            </TableCell>
                          );
                        case "合計所要時間":
                          return (
                            <TableCell key={row.id + "column3"}>
                              {tasksByTicket[row.id]
                                ?.map((task) => {
                                  return (
                                    task.achievements[0].histories?.reduce(
                                      (prev, next) => {
                                        return (
                                          prev +
                                          next.operatingTime +
                                          next.surveyTime
                                        );
                                      },
                                      0,
                                    ) / 3600
                                  );
                                })
                                .reduce((prev, next) => {
                                  return prev + next;
                                }, 0)
                                .toFixed(1)}
                            </TableCell>
                          );
                        default:
                          return (
                            <TableCell
                              key={row.id + "column4"}
                              align={column.align}
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                      }
                    })}
                    <TableCell key={row.id + "column5"}>
                      {row?.deadline &&
                        dayjs(row?.deadline).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell key={row.id + "column6"}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          setIsEditTicket(true);
                          setIsModalOpen(true);
                          setEditTicketItem(row);
                        }}
                      >
                        編集
                      </Button>
                    </TableCell>
                    <TableCell key={row.id + "column7"}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={(e) => {
                          deleteTicket(row.id);
                        }}
                      >
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={ticketItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TicketModal
        onSuccess={() => {
          inputStartBusinessTime.current &&
            inputEndBusinessTime.current &&
            storeSetting(
              inputStartBusinessTime.current,
              inputEndBusinessTime.current,
            );
        }}
        isOpen={isBusinessTimeModalOpen}
        onCloseModal={() => {
          setIsBusinessTimeModalOpen(false);
        }}
        title={"業務時間設定"}
        description={"完了予想日の計算に関連する業務時間を設定してください。"}
      >
        <FormControl
          variant={"filled"}
          sx={{
            mt: 2,
            minWidth: 120,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 5, // 子要素間にスペースを持たせる
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="業務開始時間"
              format="HH:mm"
              ampm={false}
              onChange={(value) => {
                inputStartBusinessTime.current = value;
              }}
            />
            <TimePicker
              label="業務終了時間"
              format="HH:mm"
              ampm={false}
              onChange={(value) => {
                inputEndBusinessTime.current = value;
              }}
            />
          </LocalizationProvider>
        </FormControl>
      </TicketModal>
      {isEditTicket ? (
        <TicketModal
          onSuccess={editTicket}
          isOpen={isModalOpen}
          onCloseModal={() => {
            setIsEditTicket(false);
            closeModal();
          }}
          title={"チケット編集"}
          description={"編集するチケットの情報を入力してください"}
        >
          <FormControl
            variant={"filled"}
            sx={{
              mt: 2,
              minWidth: 120,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: 5, // 子要素間にスペースを持たせる
            }}
          >
            <TextField
              label="タイトル"
              variant="outlined"
              value={editTicketItem.title}
              onChange={(e) => {
                setEditTicketItem((ticketItem) => {
                  return { ...ticketItem, title: e.target.value };
                });
              }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                value={editTicketItem.status}
                label={"Status"}
                onChange={(e) => {
                  setEditTicketItem((ticketItem) => {
                    return { ...ticketItem, status: e.target.value };
                  });
                }}
              >
                <MenuItem value={"NotYet"}>未実施</MenuItem>
                <MenuItem value={"Run"}>実行中</MenuItem>
                <MenuItem value={"Done"}>完了</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="URL"
              variant="outlined"
              value={editTicketItem.url}
              onChange={(e) => {
                setEditTicketItem((ticketItem) => {
                  return { ...ticketItem, url: e.target.value };
                });
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="デッドライン"
                value={dayjs(editTicketItem.deadline)}
                onChange={(e) => {
                  setEditTicketItem((ticketItem) => {
                    return { ...ticketItem, deadline: e?.format() };
                  });
                }}
              />
            </LocalizationProvider>
          </FormControl>
        </TicketModal>
      ) : (
        <TicketModal
          onSuccess={createTicket}
          isOpen={isModalOpen}
          onCloseModal={closeModal}
          title={"チケット新規作成"}
          description={"作成するチケットの情報を入力してください"}
        >
          <FormControl
            variant={"filled"}
            sx={{
              mt: 2,
              minWidth: 120,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: 5, // 子要素間にスペースを持たせる
            }}
          >
            <TextField
              label="タイトル"
              variant="outlined"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select value={status} label={"Status"} onChange={changeStatusId}>
                <MenuItem value={"NotYet"}>未実施</MenuItem>
                <MenuItem value={"Run"}>実行中</MenuItem>
                <MenuItem value={"Done"}>完了</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="URL"
              variant="outlined"
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="デッドライン"
                onChange={(e) => {
                  setDeadline(e.format());
                }}
              />
            </LocalizationProvider>
          </FormControl>
        </TicketModal>
      )}
    </>
  );
}
