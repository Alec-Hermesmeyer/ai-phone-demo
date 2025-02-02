import { NextResponse } from "next/server"
import { getCurrentCompany } from "@/lib/auth"
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const company = await getCurrentCompany()

    const items = await prisma.knowledgeItem.findMany({
      where: {
        companyId: company.id,
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const company = await getCurrentCompany()
    const data = await req.json()

    const item = await prisma.knowledgeItem.create({
      data: {
        companyId: company.id,
        ...data,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

