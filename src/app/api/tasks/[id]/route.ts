import { PrismaClient, Ticket } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET( _: any, {params}: {params: {id: string}}): Promise<Promise<unknown>> {
  const prisma = new PrismaClient()
  const ticket = await prisma.ticket.findMany({
    where: {
      id: Number(params.id)
    }
  })

  return NextResponse.json(ticket);
}

export async function PUT(request: NextRequest, {params}: {params: Ticket}): Promise<Promise<unknown>> {
  const prisma = new PrismaClient()
  let result = null
  let status = 200

  try {
    const { id } = params
    const data = { updatedAt: new Date(), ...await request.json() }
    result = await prisma.ticket.update({
      where: {
        id: Number(id),
      },
      data: data
    })
    console.log("update complete")
  } catch(e) {
    console.log("Error: ",e)
    status = 400
  } finally {
    return NextResponse.json(result, {status: status});
  }
}

export async function PATCH(request: NextRequest, {params}: {params: Ticket}): Promise<Promise<unknown>> {
  const prisma = new PrismaClient()
  // FIXME: curl -X PUT -H "Content-Type: application/json" -d '{"title":"タイトル"}' 'http://localhost:3000/api/tickets/2'
  let result = null
  let status = 200

  try {
    const { id } = params
    const { plan, check, feedback, achievement, ...other } = await request.json()
    const data = { updatedAt: new Date(), ...other }
    result = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        ...data,
        achievements: {
          update: {
            where: {
              id: achievement.id
            },
            data: achievement
          }
        },
      }
    })
    console.log("update complete")
  } catch(e) {
    console.log("Error: ",e)
    status = 400
  } finally {
    return NextResponse.json(result, {status: status});
  }
}

export async function DELETE(_: NextRequest, {params}: {params: Ticket}): Promise<Promise<unknown>> {
  const prisma = new PrismaClient()
  let result = null
  let status = 200

  try {
    const { id } = params

    result = await prisma.ticket.delete({
      where: {
        id: Number(id),
      }
    })
    console.log("delete complete")
  } catch(e) {
    status = 400
  } finally {
    return NextResponse.json(result, {status: status});
  }
}
