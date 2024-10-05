import { PrismaClient, Setting } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Setting },
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();
  let setting;
  let status;
  try {
    setting = await prisma.setting.findFirst({
      where: {
        id: 1,
      },
    });
    console.log("get setting complete");
  } catch (e) {
    console.log("Error: ", e);
    status = 400;
  } finally {
    prisma.$disconnect();
    return NextResponse.json(setting, { status: status });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Setting },
): Promise<Promise<unknown>> {
  const prisma = new PrismaClient();

  const data: {
    startBusinessTime: string;
    endBusinessTime: string;
  } = await request.json();
  console.log(data.startBusinessTime, data.endBusinessTime);
  let setting;
  let status;
  try {
    setting = await prisma.setting.upsert({
      where: {
        id: 1,
      },
      create: {
        startBusinessTime: data.startBusinessTime,
        endBusinessTime: data.endBusinessTime,
      },
      update: {
        startBusinessTime: data.startBusinessTime,
        endBusinessTime: data.endBusinessTime,
      },
    });
    console.log("upsert setting complete");
  } catch (e) {
    console.log("Error: ", e);
    status = 400;
  } finally {
    prisma.$disconnect();
    return NextResponse.json(setting, { status: status });
  }
}
