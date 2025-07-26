// app/api/add-update/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { text, imageUrl, color } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 });
    }
    
    const newUpdate = await prisma.update.create({ 
      data: { 
        text, 
        imageUrl: imageUrl || null, 
        color: color || '#3B82F6' 
      } 
    });
    return NextResponse.json(newUpdate, { status: 201 });
  } catch (e: any) {
    console.error('Error creating update:', e);
    
    // Check if it's a database connection error
    if (e?.code === 'P1001') {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    
    // Check if it's a schema error
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: "Duplicate entry" }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: "Failed to create update",
      details: process.env.NODE_ENV === 'development' ? e?.message : undefined
    }, { status: 500 });
  }
}
