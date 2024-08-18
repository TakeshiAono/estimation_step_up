import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(request: NextRequest, {params}: {params: Ticket}): Promise<Promise<unknown>> {
  let result = null
  let status = 200

  try {
    const {url, title, status} = await request.json()
    result = await prisma.ticket.create({
      data: {
        url: url,
        title: title,
        status: status,
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