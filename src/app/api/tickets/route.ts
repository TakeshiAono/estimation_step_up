import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<Promise<unknown>> {
  const prisma = new PrismaClient()
  let result = null
  let status = 200

  try {
    // const {url, title, status} = await request.json()
    result = await prisma.ticket.findMany()
    console.log("index complete")
  } catch(e) {
    console.log("Error: ", e)
    status = 400
  } finally {
    return NextResponse.json(result, {status: status});
  }
}
