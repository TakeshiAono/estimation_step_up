import { Achievement, PrismaClient, Ticket } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Ticket },
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  let result = null;
  let status = 200;

  try {
    const { id } = params;
    const { surveyTime, operatingTime } = await request.json();

    const task = await prisma.task.findFirst({
      where: {
        id: Number(id)
      }
    })

    let achievement
    if(task) {
      achievement = await prisma.achievement.findFirst({
        where: {
          taskId: task.id
        }
      })
    }

    console.log("レコード0",achievement)
    console.log("だい",dayjs().startOf('day').toDate())
    let historyRecord
    if(achievement) {
      historyRecord = await prisma.history.create({
        data: {
          isActive: true,
          // TODO: achievementの誤字を修正する
          achivementId: achievement.id,
          surveyTime: surveyTime,
          operatingTime: operatingTime,
        }
      });
    }

    console.log("history create complete");
  } catch (e) {
    console.log("Error: ", e);
    status = 400;
  } finally {
    prisma.$disconnect();
    return NextResponse.json(result, { status: status });
  }
}

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

    const task = await prisma.task.findFirst({
      where: {
        id: Number(id)
      }
    })

    let achievement
    if(task) {
      achievement = await prisma.achievement.findFirst({
        where: {
          taskId: task.id
        }
      })
    }

    let historyRecord
    if(achievement) {
      historyRecord = await prisma.history.findFirst({
        where: {
          createdAt: {
            gte: dayjs().startOf('day').toDate(),
          },
          achivementId: achievement.id  // 必要なフィールドでフィルタリング
        },
      });
    }

    if (historyRecord) {
      result = await prisma.achievement.update({
        where: {
          taskId: Number(id),
        },
        data: {
          histories: {
            update: {
              where: {
                id: historyRecord.id,  // 特定したIDで更新
              },
              data: {
                surveyTime: surveyTime,
                operatingTime: operatingTime,
              }
            }
          }
        }
      });
    }

    console.log("history update complete");
  } catch (e) {
    console.log("Error: ", e);
    status = 400;
  } finally {
    prisma.$disconnect();
    return NextResponse.json(result, { status: status });
  }
}
