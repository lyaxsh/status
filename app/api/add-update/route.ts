// app/api/add-update/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { text, imageUrl, color } = await req.json();
    const newUpdate = await prisma.update.create({ 
      data: { 
        text, 
        imageUrl, 
        color: color || '#3B82F6' 
      } 
    });
    return NextResponse.json(newUpdate, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create update" }, { status: 500 });
  }
}
