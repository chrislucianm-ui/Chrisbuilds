import crypto from "crypto";

const SECRET = process.env.JWT_SECRET || "chrisbuilds-super-secret-key-2026-studio-admin-vault";

export function signSession(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(`${header}.${data}`).digest("base64url");
  return `${header}.${data}.${signature}`;
}

export function verifySession(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, data, signature] = parts;
    const expectedSig = crypto.createHmac("sha256", SECRET).update(`${header}.${data}`).digest("base64url");
    if (signature !== expectedSig) return null;
    
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    
    // Check expiration
    if (payload.exp && Date.now() > payload.exp) {
      console.log("[Auth Session] Session token has expired.");
      return null;
    }
    
    return payload;
  } catch (err) {
    console.error("[Auth Session] Session verification exception:", err);
    return null;
  }
}
