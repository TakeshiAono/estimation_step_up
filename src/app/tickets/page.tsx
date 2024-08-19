"use client";

import { useEffect, useState } from "react";
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
import axios from "axios";

export default function TicketView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("NotYet");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [ticketItems, setTicketItems] = useState<any>([])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      const {data} = await axios.get("http://localhost:3001/api/tickets")
      console.log(data)
      return data.sort((item) => item.id).reverse()
    }
    fetchTickets().then((reuslt) => {setTicketItems(reuslt)})
  }, [])

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const TicketStatuses = {
    NotYet: 0,
    Run: 1,
    Done: 2
  }

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
  ];

  function createData(
    id: string,
    status: string,
    title: string,
    url: number,
    numberOfTask: number,
    totalTime: number
  ) {
    return { id, status, title, url, numberOfTask, totalTime };
  }

  const createTicket = async () => {
    const foundItem = _.maxBy(ticketItems, (item) => Number(item.id))

    let nextId
    if (foundItem) {
      nextId = Number(foundItem.id) + 1
    } else {
      nextId = 1
    }

    try {
      await axios.post(`http://localhost:3001/api/tickets/create`, JSON.stringify({title: title, status: TicketStatuses[status], url: url}))
      const newItem = createData(nextId.toString(), TicketStatuses[status], title, url, 0, 0)
      setTicketItems([ newItem, ...ticketItems])
    } catch (e) {
      console.log("リクエストエラー")
    } finally {
      closeModal()
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const changeStatusId = (event) => {
    setStatus(
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
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
        count={ticketItems.length}
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
              value={status}
              label={"Status"}
              onChange={changeStatusId}
            >
              <MenuItem value={"NotYet"}>未実施</MenuItem>
              <MenuItem value={"Run"}>実行中</MenuItem>
              <MenuItem value={"Done"}>完了</MenuItem>
            </Select>
          </FormControl>
          <TextField label="URL" variant="outlined" onChange={(e) => {setUrl(e.target.value)}}/>
        </FormControl>
      </Modal>
    </>
  );
}
