// lib/mpesa-utils.ts
export function generateMpesaTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
export function generateMpesaPassword(
  shortCode: string,
  passkey: string,
  timestamp: string
): string {
  const rawPassword = shortCode + passkey + timestamp;
  return Buffer.from(rawPassword).toString("base64");
}
