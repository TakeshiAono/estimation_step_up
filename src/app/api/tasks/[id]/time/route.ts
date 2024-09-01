import { PrismaClient, Ticket } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Ticket },
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  let result = null;
  let status = 200;

  try {
    const { id } = params;
    const { surveyTime, operatingTime } = await request.json();

    result = await prisma.achievement.update({
      where: {
        taskId: Number(id),
      },
      data: {
        surveyTime: surveyTime,
        operatingTime: operatingTime,
      },
    });
    console.log("time update complete");
  } catch (e) {
    console.log("Error: ", e);
    status = 400;
  } finally {
    prisma.$disconnect();
    return NextResponse.json(result, { status: status });
  }
}
