import { Task } from "@/schema/zod";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Task }
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  let status = 200;

  const body: Task[] = await request.json()

  let results = []
  try {
    const { id } = params;
    results = await Promise.all(body.map((taskItem) => {
      return prisma.task.create({
          data: {
            isSurveyTask: true,
            parentId: Number(id),
            status: 0,
            type: 0,
            title: taskItem.title,
            plans:
              {create: {
                predictionRequiredTimeOfFirst: Number(taskItem.hour)
              }},
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
        })
      }
    ))
    console.log("create child complete");
  } catch (e) {
    console.log("Error: ", e);
    status = 400;
  } finally {
    prisma.$disconnect()
    return NextResponse.json(results, { status: status });
  }
}
