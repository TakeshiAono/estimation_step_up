import { PrismaClient, Ticket } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest, {params}: {params: Ticket}): Promise<Promise<unknown>> {
  let result = null
  let status = 200

  try {
    const { id } = params
    const { surveyTime, operatingTime } = await request.json()

    result = await prisma.achievement.update({
      where: {
        taskId: Number(id),
      },
      data: {
        surveyTime: surveyTime,
        operatingTime: operatingTime
      }
    })
    console.log("time update complete")
  } catch(e) {
    console.log("Error: ",e)
    status = 400
  } finally {
    return NextResponse.json(result, {status: status});
  }
}
