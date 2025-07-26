// app/api/updates/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const pageParam = url.searchParams.get("page") ?? "1";
    const limitParam = url.searchParams.get("limit") ?? "10";

    const page = Math.max(parseInt(pageParam, 10), 1);
    const limit = Math.max(parseInt(limitParam, 10), 1);

    // total number of updates
    const totalCount = await prisma.update.count();

    // fetch the slice for this page
    const updates = await prisma.update.findMany({
      orderBy: { createdAt: "desc" },           // newest first
      skip: (page - 1) * limit,
      take: limit,
    });

    const hasMore = page * limit < totalCount;

    return NextResponse.json({
      updates,
      hasMore,
      page,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch updates" },
      { status: 500 }
    );
  }
}
