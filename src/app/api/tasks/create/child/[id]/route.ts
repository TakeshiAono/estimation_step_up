import { Task } from "@/schema/zod";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Task }
): Promise<Promise<unknown>> {
  let result = null;
  let status = 200;

  try {
    const { id } = params;
    result = await prisma.task.create({
      data: {
        isSurveyTask: true,
        parentId: Number(id),
        status: 0,
        type: 0,
        plans:
          {create: {}},
        achievements:
          {create: {}},
        checks:
          {create: {}},
        feedbacks:
          {create: {}},
      },
      include: {
        plans: true,
        achievements: true,
        checks: true,
        feedbacks: true
      }
    });
    console.log("create child complete");
  } catch (e) {
    console.log("Error: ", e);
    status = 400;
  } finally {
    return NextResponse.json(result, { status: status });
  }
}
