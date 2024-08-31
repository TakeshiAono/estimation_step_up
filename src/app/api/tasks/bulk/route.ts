import { Task, TaskRelations } from "@/schema/zod";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import _ from "lodash"

type Hierarchy = {
  parentId: number;
  childId: number | null;
}

type BigTask = Task & TaskRelations

const extractHierarchy = (parentTask: BigTask): Hierarchy[] => {
  const parentId = parentTask.id
  const childrenTask = parentTask.children
  if (childrenTask.length == 0) return [{parentId: parentId, childId: null}]
  const childrenTaskId = childrenTask.map((task) => task.id)
  return childrenTaskId.map((childTaskId: number) => { return{ parentId: parentId, childId: childTaskId }})
}

const depthSearch = (parentTask: BigTask): Hierarchy[]  => {
  const childrenTask = parentTask.children

  if(childrenTask.length === 0 ) return []

  const taskInfo: Hierarchy[] = childrenTask.map(childTask => depthSearch(childTask))[0] // 1引数は定義せず 2引数を定義
  return [...extractHierarchy(parentTask), ...taskInfo]
}

export async function PUT(request: NextRequest, {params}: {params: Task}): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  let result = null
  let status = 200

  try {
    const tasks: Task[] = await request.json()
    const topTaskIds = tasks.map(task => task.id)
    const hierarchyList: Hierarchy[] = _.flatten(tasks.map(topTask => depthSearch(topTask)))

    for (const topTaskId of topTaskIds) {
      await prisma.task.update({
        where: {
          id: topTaskId,
        },
        data: {
          parentId: null,
        },
      });
    }

    if (hierarchyList.length !== 0) {
      for (const hierarchy of hierarchyList) {
        if (hierarchy.childId !== null) {
          await prisma.task.update({
            where: {
              id: hierarchy.childId,
            },
            data: {
              parentId: hierarchy.parentId,
            },
          });
        }
      }
    }
    console.log("bulk update complete")
  } catch(e) {
    console.log("Error: ", e)
    status = 400
  } finally {
    prisma.$disconnect()
    return NextResponse.json(result, {status: status});
  }
}