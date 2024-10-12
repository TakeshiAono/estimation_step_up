import { PrismaClient, Ticket } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: any,
  { params }: { params: { id: string } },
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  const ticket = await prisma.ticket.findMany({
    where: {
      id: Number(params.id),
    },
  });

  return NextResponse.json(ticket);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Ticket },
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  // FIXME: curl -X PUT -H "Content-Type: application/json" -d '{"title":"タイトル"}' 'http://localhost:3001/api/tickets/2'
  let result = null;
  let status = 200;

  try {
    const { id } = params;
    const newTicket: Ticket = {
      updatedAt: new Date(),
      ...(await request.json()),
    };

    const ticketResult = await prisma.ticket.findFirst({
      where: {
        id: Number(params.id),
      },
    });
    if (!ticketResult) throw new Error("ticket not found");
    const prevTicket = ticketResult;

    if (prevTicket.deadline && newTicket.deadline) {
      if (dayjs(prevTicket.deadline) < dayjs(newTicket.deadline)) {
        newTicket.isNotified = false;
      }
    }

    result = await prisma.ticket.update({
      where: {
        id: Number(id),
      },
      data: newTicket,
    });
    console.log("update complete");
  } catch (e) {
    console.log("Error", e);
    status = 400;
  } finally {
    prisma.$disconnect();
    return NextResponse.json(result, { status: status });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Ticket },
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  let result = null;
  let status = 200;

  try {
    const { id } = params;

    result = await prisma.ticket.delete({
      where: {
        id: Number(id),
      },
    });
    console.log("delete complete");
  } catch (e) {
    status = 400;
  } finally {
    prisma.$disconnect();
    return NextResponse.json(result, { status: status });
  }
}
