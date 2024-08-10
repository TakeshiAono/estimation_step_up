"use client";

import { useState } from "react";
import _ from "lodash";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import Link from "next/link";

export default function TicketView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
    status: string,
    title: string,
    url: number,
    numberOfTask: number,
    totalTime: number
  ) {
    return { ticketId, status, title, url, numberOfTask, totalTime };
  }

  const rows = [
    createData("1", "status", "test1", 1324171354, 3287263, 1),
    createData("2", "status", "test1", 1403500365, 9596961, 1),
    createData("3", "status", "test1", 60483973, 301340, 1),
    createData("4", "status", "US", 327167434, 9833520, 1),
    createData("5", "status", "CA", 37602103, 9984670, 1),
    createData("6", "status", "AU", 25475400, 7692024, 1),
    createData("7", "status", "DE", 83019200, 357578, 1),
    createData("1", "status", "test1", 1324171354, 3287263, 1),
    createData("2", "status", "test1", 1403500365, 9596961, 1),
    createData("3", "status", "test1", 60483973, 301340, 1),
    createData("4", "status", "US", 327167434, 9833520, 1),
    createData("5", "status", "CA", 37602103, 9984670, 1),
    createData("6", "status", "AU", 25475400, 7692024, 1),
    createData("7", "status", "DE", 83019200, 357578, 1),
  ];

  return (
    <>
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
            {rows
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
    </>
  );
}
