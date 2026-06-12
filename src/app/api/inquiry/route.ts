import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { name, email, phone, service, message } = await request.json();

    // 1. Basic validation
    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: "Missing required parameters. Please verify name, email, phone, scope, and message." },
        { status: 400 }
      );
    }

    const newInquiry = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      service,
      message,
      status: "unread",
      timestamp: new Date().toISOString()
    };

    // 2. Save to local JSON Database
    const dirPath = path.join(process.cwd(), "data");
    const filePath = path.join(dirPath, "inquiries.json");

    try {
      // Ensure directory exists
      await fs.mkdir(dirPath, { recursive: true });

      // Read current list
      let inquiriesList = [];
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        inquiriesList = JSON.parse(fileContent);
      } catch (err) {
        // File does not exist or is malformed, initialize empty list
      }

      inquiriesList.push(newInquiry);
      await fs.writeFile(filePath, JSON.stringify(inquiriesList, null, 2), "utf-8");
      console.log(`Successfully logged inquiry ID ${newInquiry.id} to local database.`);
    } catch (err) {
      console.error("Local database save failed:", err);
    }

    // 3. Dispatch Phone Push Notification via ntfy.sh
    try {
      const pushMessage = `Inquirer: ${name}\nEmail: ${email}\nPhone: ${phone}\nScope: ${service}\nMessage: ${message}`;
      await fetch("https://ntfy.sh/chrisbuilds_alerts_8738882912", {
        method: "POST",
        body: pushMessage,
        headers: {
          "Title": "ChrisBuilds - New Inquiry Received",
          "Priority": "high",
          "Tags": "incoming_envelope,sparkles"
        }
      });
      console.log("Successfully sent push alert to ntfy.sh/chrisbuilds_alerts_8738882912");
    } catch (err) {
      console.error("Phone push notification failed:", err);
    }

    // 4. Dispatch Email Notification via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #6c00d9; margin-top: 0;">New Project Inquiry</h2>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service Scope:</strong> ${service.toUpperCase()}</p>
        <p><strong>Message Details:</strong></p>
        <div style="white-space: pre-wrap; background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6;">${message}</div>
        <p style="font-size: 11px; color: #94a3b8; margin-top: 30px;">This inquiry was captured and logged in your Next.js local database.</p>
      </div>
    `;

    if (resendApiKey) {
      try {
        console.log("[API Inquiry] Initiating email transmission via Resend API...");
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "ChrisBuilds <onboarding@resend.dev>",
            to: "chrisbuilds.dev@gmail.com",
            subject: `New Client Inquiry: ${name}`,
            html: emailHtml
          })
        });

        if (response.ok) {
          const resData = await response.json();
          console.log("[API Inquiry] Resend email sent successfully. ID:", resData.id);
        } else {
          const errText = await response.text();
          console.error(`[API Inquiry] Resend email dispatch failed with status ${response.status}:`, errText);
        }
      } catch (err) {
        console.error("[API Inquiry] Resend API email transmission encountered a connection error:", err);
      }
    } else {
      // Fallback: Write email notification metadata locally as mock dispatch logs
      try {
        const emailLogPath = path.join(dirPath, "email_logs.txt");
        const logContent = `[${new Date().toISOString()}] Email alert mock to chrisbuilds.dev@gmail.com\nSubject: New Client Inquiry: ${name}\nScope: ${service}\nSender: ${name} (${email}, ${phone})\nMessage: ${message}\n----------------------------------------------------------------------\n`;
        await fs.appendFile(emailLogPath, logContent, "utf-8");
        console.log("Resend API key missing. Logged email notification mockup to data/email_logs.txt");
      } catch (err) {
        console.error("Mock email log append failed:", err);
      }
    }

    // 5. Success response to visitor client
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API handler error:", error);
    return NextResponse.json(
      { error: "Internal server error processing inquiry" },
      { status: 500 }
    );
  }
}
