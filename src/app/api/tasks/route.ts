import { PrismaClient, Task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Task}): Promise<Promise<unknown>> {
  const prisma = new PrismaClient()
  let tasks = null
  let status = 200

  try {
    tasks = await prisma.task.findMany({
      include: {
        plans: true,
        achievements: true,
        checks: true,
        feedbacks: true,
      }
    })

    console.log("get tasks complete")
  } catch(e) {
    console.log("Error: ", e)
    status = 400
  } finally {
    return NextResponse.json(tasks, {status: status});
  }
}