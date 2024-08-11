"use client";

import { useState } from "react";
import _ from "lodash";
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
import Link from "next/link";
import Modal from "../components/Modal";

export default function TicketView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusId, setStatusId] = useState("notYet");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const ticketStatuses = {
    notYet: 0,
    run: 1,
    done: 2
  }

  interface Column {
    id: "ticketId" | "title" | "url" | "numberOfTask" | "totalTime" | "status";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
  }

  const columns: readonly Column[] = [
    { id: "ticketId", label: "TicketID", minWidth: 20 },
    { id: "status", label: "状況", minWidth: 50 },
    { id: "title", label: "title", minWidth: 50 },
    { id: "url", label: "URL", minWidth: 100 },
    { id: "numberOfTask", label: "タスク数", minWidth: 20 },
    { id: "totalTime", label: "合計所要時間", minWidth: 20 },
  ];

  function createData(
    ticketId: string,
    status: number,
    title: string,
    url: number,
    numberOfTask: number,
    totalTime: number
  ) {
    return { ticketId, status, title, url, numberOfTask, totalTime };
  }

  const rows = [
    createData("1", "notYet", "test1", 1324171354, 3287263, 1),
    createData("2", "run", "test1", 1403500365, 9596961, 1),
    createData("3", "run", "test1", 60483973, 301340, 1),
    createData("4", "run", "US", 327167434, 9833520, 1),
    createData("5", "run", "CA", 37602103, 9984670, 1),
    createData("6", "run", "AU", 25475400, 7692024, 1),
    createData("7", "run", "DE", 83019200, 357578, 1),
  ].sort((a, b) => Number(a.ticketId) - Number(b.ticketId)).reverse();

  const [ticketItems, setTicketItems] = useState<any>(rows)

  const createTicket = () => {
    console.log("statusId",statusId)

    const foundItem = _.maxBy(ticketItems, (item) => Number(item.ticketId))

    let nextId
    if (foundItem) {
      nextId = Number(foundItem.ticketId) + 1
    } else {
      nextId = 1
    }

    const newItem = createData(nextId.toString(), statusId, title, url, 0, 0)

    setTicketItems([ newItem, ...ticketItems])
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const changeStatusId = (event) => {
    setStatusId(
      event.target.value,
    );
  };

  return (
    <>
      <Button variant="contained" onClick={openModal}>
        チケット作成
      </Button>
      <Link href="/">
        <p>タスク一覧へ</p>
      </Link>
      {/* <Button variant="contained" onClick={createTicket}>チケット追加</Button> */}
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.ticketId}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal onSuccess={createTicket} isOpen={isModalOpen} onCloseModal={closeModal}>
        <FormControl variant={"filled"} sx={{
          mt: 2,
          minWidth: 120,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: 5, // 子要素間にスペースを持たせる
        }}>
          <TextField label="タイトル" variant="outlined" onChange={(e) => {setTitle(e.target.value)}}/>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              value={statusId}
              label={"Status"}
              onChange={changeStatusId}
            >
              <MenuItem value={"notYet"}>未実施</MenuItem>
              <MenuItem value={"run"}>実行中</MenuItem>
              <MenuItem value={"done"}>完了</MenuItem>
            </Select>
          </FormControl>
          <TextField label="URL" variant="outlined" onChange={(e) => {setUrl(e.target.value)}}/>
        </FormControl>
      </Modal>
    </>
  );
}
