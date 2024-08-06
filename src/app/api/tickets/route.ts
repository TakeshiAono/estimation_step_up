import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<Promise<unknown>> {
  const prisma = new PrismaClient()
  let result = null
  let status = 200

  try {
    const data = { createdAt: new Date(), updatedAt: new Date(), ...await request.json() }
    result = await prisma.ticket.create({
      data: data
    })
    console.log("update complete")
  } catch(e) {
    status = 400
  } finally {
    return NextResponse.json(result, {status: status});
  }
}