import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { verifySession } from "../auth/session";

// Auth helper
async function isAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session_token")?.value;
    if (!token) return false;

    const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
    const session = verifySession(token);
    return session && session.username === ADMIN_USER;
  } catch (err) {
    console.error("[API Inquiries Auth] Verification check failure:", err);
    return false;
  }
}

const dbPath = path.join(process.cwd(), "data", "inquiries.json");

// 1. GET - Fetch all inquiries sorted by date descending
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized. Valid administrator session required." }, { status: 401 });
  }

  try {
    let inquiries = [];
    try {
      const fileContent = await fs.readFile(dbPath, "utf-8");
      const parsed = JSON.parse(fileContent);
      if (Array.isArray(parsed)) {
        inquiries = parsed.map((item: any) => ({
          ...item,
          status: item.status || "unread",
          phone: item.phone || "N/A",
          service: item.service || "webdev"
        }));
      }
    } catch (err) {
      // File does not exist or is empty, return empty list
    }

    // Sort by timestamp descending (newest first)
    inquiries.sort((a: any, b: any) => {
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("[API Inquiries] Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

// 2. PUT - Update the status of an inquiry (e.g. read, unread, contacted)
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized. Valid administrator session required." }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Parameters id and status are required." }, { status: 400 });
    }

    let inquiries = [];
    try {
      const fileContent = await fs.readFile(dbPath, "utf-8");
      inquiries = JSON.parse(fileContent);
    } catch (err) {
      return NextResponse.json({ error: "Database file not found." }, { status: 404 });
    }

    const index = inquiries.findIndex((item: any) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    // Update status
    inquiries[index].status = status;

    await fs.writeFile(dbPath, JSON.stringify(inquiries, null, 2), "utf-8");
    console.log(`[API Inquiries] Updated status of inquiry ID ${id} to: ${status}`);

    return NextResponse.json({ success: true, updated: inquiries[index] });
  } catch (error) {
    console.error("[API Inquiries] Update error:", error);
    return NextResponse.json({ error: "Failed to update inquiry status" }, { status: 500 });
  }
}

// 3. DELETE - Permanently remove an inquiry
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized. Valid administrator session required." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Query parameter id is required." }, { status: 400 });
    }

    let inquiries = [];
    try {
      const fileContent = await fs.readFile(dbPath, "utf-8");
      inquiries = JSON.parse(fileContent);
    } catch (err) {
      return NextResponse.json({ error: "Database file not found." }, { status: 404 });
    }

    const initialLength = inquiries.length;
    inquiries = inquiries.filter((item: any) => item.id !== id);

    if (inquiries.length === initialLength) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    await fs.writeFile(dbPath, JSON.stringify(inquiries, null, 2), "utf-8");
    console.log(`[API Inquiries] Permanently deleted inquiry ID ${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Inquiries] Deletion error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
