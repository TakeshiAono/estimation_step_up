import { Achievement, PrismaClient, Ticket } from "@prisma/client";
import dayjs from "dayjs";
import _ from "lodash";
import { NextRequest, NextResponse } from "next/server";
import seedrandom from "seedrandom";

export async function POST(
  request: NextRequest,
  { params }: { params: Ticket },
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  let result = null;
  let status = 200;

  const { taskTermId } = await request.json();

  try {
    const { id } = params;

    const task = await prisma.task.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!task) throw new Error("タスクがありません");

    let selectedIndex = null;
    const sameIdTerm: { start: string; end: string } =
      task.operatedTermsJsonForTimeBarChart?.filter((term, index) => {
        if (term.taskTermId === taskTermId) {
          selectedIndex = index;
          return true;
        }
      })[0];

    const rgbString = `rgb(${Math.round(seedrandom(task.id + 1)() * 255)},${Math.round(seedrandom(task.id + 2)() * 255)},${Math.round(seedrandom(task.id + 3)() * 255)})`;
    if (sameIdTerm) {
      const mutationTerm = {
        ...sameIdTerm,
        end: dayjs().format().toString(),
        taskTermId: taskTermId,
        color: rgbString,
      };
      _.remove(
        task?.operatedTermsJsonForTimeBarChart,
        (term) => term == sameIdTerm,
      );
      await prisma.task.update({
        where: {
          id: Number(id),
        },
        data: {
          operatedTermsJsonForTimeBarChart: [
            ...task?.operatedTermsJsonForTimeBarChart,
            mutationTerm,
          ],
          // operatedTermsJsonForTimeBarChart: JSON.stringify(["mutationTerm", "test"])
        },
      });
    } else {
      if (task?.operatedTermsJsonForTimeBarChart) {
        const addTerm = {
          start: dayjs().format().toString(),
          end: dayjs().format().toString(),
          taskTermId: taskTermId,
          color: rgbString,
        };
        await prisma.task.update({
          where: {
            id: Number(id),
          },
          data: {
            operatedTermsJsonForTimeBarChart: [
              ...task?.operatedTermsJsonForTimeBarChart,
              addTerm,
            ],
            // operatedTermsJsonForTimeBarChart: JSON.stringify(["mutationTerm", "test"])
          },
        });
      } else {
        const addTerm = {
          start: dayjs().format().toString(),
          end: dayjs().format().toString(),
          taskTermId: taskTermId,
          color: rgbString,
        };
        await prisma.task.update({
          where: {
            id: Number(id),
          },
          data: {
            operatedTermsJsonForTimeBarChart: [addTerm],
          },
        });
      }
    }

    console.log("term update complete");
  } catch (e) {
    console.log("Error: ", e);
    status = 400;
  } finally {
    prisma.$disconnect();
    return NextResponse.json(result, { status: status });
  }
}
