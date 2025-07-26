// app/api/auth/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

/**
 * Simple cookie‑based auth check.
 * Returns true if the incoming request has a valid "admin_auth" cookie.
 */
async function isAuthenticated(cookies: NextRequest["cookies"]): Promise<boolean> {
  return cookies.get("admin_auth")?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  try {
    const authenticated = await isAuthenticated(req.cookies);

    if (authenticated) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Authentication check failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    const correctPasscode = process.env.ADMIN_PASSCODE || "admin123";

    if (passcode !== correctPasscode) {
      return NextResponse.json(
        { error: "Invalid passcode" },
        { status: 401 }
      );
    }

    // Build a response and set the auth cookie on it
    const res = NextResponse.json({ success: true });
    res.cookies.set({
      name: "admin_auth",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",               // send on all routes
    });

    return res;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
