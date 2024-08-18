import { PrismaClient, Task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, {params}: {params: Task}): Promise<Promise<unknown>> {
  const prisma = new PrismaClient()
  let result = null
  let status = 200

  try {
    const body: Task = await request.json()

    result = await prisma.task.create({
      data: {
        ...body,
        plans: {
          create: {}
        },
        achievements: {
          create: {}
        },
        checks: {
          create: {}
        },
        feedbacks: {
          create: {}
        }
      },
      include: {
        plans: true,
        achievements: true,
        checks: true,
        feedbacks: true
      }
    })
    console.log("create complete")
  } catch(e) {
    console.log("Error: ", e)
    status = 400
  } finally {
    return NextResponse.json(result, {status: status});
  }
}