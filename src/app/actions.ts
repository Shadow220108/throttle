"use server";

import { promises as fs } from "node:fs";
import path from "node:path";

export type WaitlistState = { ok: boolean; message: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Adds an email to the waitlist.
 * - If AIRTABLE_API_KEY + AIRTABLE_BASE_ID are set, writes a row to Airtable
 *   (table AIRTABLE_TABLE, default "Waitlist", with an "Email" field).
 * - Otherwise (local dev) appends to .data/waitlist.json.
 */
export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  // Honeypot: real people never fill this hidden field.
  if (formData.get("company")) return { ok: true, message: "You're on the list!" };
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, message: "That email doesn't look right. Mind checking it?" };
  }

  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE } = process.env;

  try {
    if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID) {
      const table = encodeURIComponent(AIRTABLE_TABLE || "Waitlist");
      const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: [{ fields: { Email: email } }], typecast: true }),
      });
      if (!res.ok) throw new Error(`Airtable responded ${res.status}`);
    } else {
      const dir = path.join(process.cwd(), ".data");
      const file = path.join(dir, "waitlist.json");
      await fs.mkdir(dir, { recursive: true });
      let list: { email: string; at: string }[] = [];
      try {
        list = JSON.parse(await fs.readFile(file, "utf8"));
      } catch {
        // first signup
      }
      if (!list.some((row) => row.email === email)) {
        list.push({ email, at: new Date().toISOString() });
        await fs.writeFile(file, JSON.stringify(list, null, 2));
      }
    }
  } catch (err) {
    console.error("waitlist signup failed", err);
    return { ok: false, message: "Something broke on our end. Try again in a minute?" };
  }

  return { ok: true, message: "You're on the list! We'll email you the moment Throttle opens." };
}
