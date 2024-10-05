import { Statuses } from "@/app/constants/TaskConstants";
import { PrismaClient, Task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Task },
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  let tasks = null;
  let status = 200;

  let ticketId = null;
  if (request.nextUrl.searchParams.has("ticketId")) {
    ticketId = request.nextUrl.searchParams.get("ticketId");
  }

  // NOTE: クエリパラメータが存在している場合に対応
  let ticketIdObject = null;
  if (ticketId) {
    ticketIdObject = { ticketId: Number(ticketId) };
  }

  try {
    tasks = await prisma.task.findMany({
      where: {
        ...ticketIdObject,
        // parentId: null,
        status: {
          not: Statuses.Done,
        },
      },
      include: {
        plans: true,
        achievements: {
          include: {
            histories: true,
          },
        },
        checks: true,
        feedbacks: true,
        children: {
          where: {
            status: {
              not: Statuses.Done,
            },
          },
          include: {
            plans: true,
            achievements: {
              include: {
                histories: true,
              },
            },
            checks: true,
            feedbacks: true,
            children: {
              where: {
                status: {
                  not: Statuses.Done,
                },
              },
              include: {
                plans: true,
                achievements: {
                  include: {
                    histories: true,
                  },
                },
                checks: true,
                feedbacks: true,
                children: {
                  where: {
                    status: {
                      not: Statuses.Done,
                    },
                  },
                  include: {
                    plans: true,
                    achievements: {
                      include: {
                        histories: true,
                      },
                    },
                    checks: true,
                    feedbacks: true,
                    children: {
                      where: {
                        status: {
                          not: Statuses.Done,
                        },
                      },
                      include: {
                        plans: true,
                        achievements: {
                          include: {
                            histories: true,
                          },
                        },
                        checks: true,
                        feedbacks: true,
                        children: {
                          where: {
                            status: {
                              not: Statuses.Done,
                            },
                          },
                          include: {
                            plans: true,
                            achievements: {
                              include: {
                                histories: true,
                              },
                            },
                            checks: true,
                            feedbacks: true,
                            children: {},
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log("get tasks complete");
  } catch (e) {
    console.log("Error: ", e);
    status = 400;
  } finally {
    prisma.$disconnect();
    return NextResponse.json(tasks, { status: status });
  }
}
