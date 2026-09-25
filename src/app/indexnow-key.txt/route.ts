import { connection } from "next/server";

// IndexNow key file (keyLocation in submissions points here). Read per
// request, so a key added in Vercel after a build still shows up.
export async function GET() {
  await connection();
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain" } });
}
