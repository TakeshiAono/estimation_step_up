import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Ticket },
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  let result = null;
  let status = 200;

  try {
    const { url, title, status } = await request.json();
    result = await prisma.ticket.create({
      data: {
        url: url,
        title: title,
        status: status,
      },
    });
    console.log("create complete");
  } catch (e) {
    console.log("Error: ", e);
    status = 400;
  } finally {
    prisma.$disconnect();
    return NextResponse.json(result, { status: status });
  }
}
