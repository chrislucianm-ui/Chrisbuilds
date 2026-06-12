import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signSession, verifySession } from "./session";

// Fallback admin credentials
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "chrisbuilds2026";

// 1. GET - Check auth session status
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = verifySession(token);
    if (!session || session.username !== ADMIN_USER) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, username: session.username });
  } catch (err) {
    console.error("[API Auth] Status verification error:", err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// 2. POST - Authenticate admin credentials and set secure HTTP-only cookie
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password parameters are required." },
        { status: 400 }
      );
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      console.log(`[API Auth] Failed login attempt for username: ${username}`);
      return NextResponse.json(
        { error: "Invalid admin username or password credentials." },
        { status: 401 }
      );
    }

    // Sign session token expiring in 24 hours
    const token = signSession({
      username,
      exp: Date.now() + 24 * 60 * 60 * 1000
    });

    const cookieStore = await cookies();
    cookieStore.set("admin_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60 // 24 hours
    });

    console.log(`[API Auth] Successfully authenticated admin session for username: ${username}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Auth] Login error:", err);
    return NextResponse.json({ error: "Internal server error during authentication" }, { status: 500 });
  }
}

// 3. DELETE - Logout and purge session cookie
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("admin_session_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0 // Expire immediately
    });
    console.log("[API Auth] Administrative logout completed. Session cookie purged.");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Auth] Logout error:", err);
    return NextResponse.json({ error: "Internal server error during logout" }, { status: 500 });
  }
}
