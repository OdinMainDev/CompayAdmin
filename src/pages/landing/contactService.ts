// src/pages/landing/contactService.ts
export type ContactPayload = { username: string };

export type ContactResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

function asText(v: unknown): string {
  if (typeof v === "string") return v;
  if (v == null) return "";
  return String(v);
}

export async function submitContact(endpoint: string, payload: ContactPayload): Promise<ContactResult> {
  try {
    const body = new URLSearchParams();
    body.set("username", payload.username);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body.toString(),
    });

    const text = await res.text();

    if (!res.ok) {
      return { ok: false, message: text || `HTTP ${res.status}` };
    }

    return { ok: true, message: asText(text) || "OK" };
  } catch {
    return { ok: false, message: "Network error" };
  }
}
