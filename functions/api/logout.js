export async function onRequestPost({ request, env }) {
  const db = env["freshtube-db"];

  const cookie = request.headers.get("Cookie") || "";
  const token = cookie
    .split("; ")
    .find(c => c.startsWith("session="))
    ?.split("=")[1];

  if (token) {
    await db.prepare(
      "UPDATE sessions SET is_revoked = 1 WHERE session_token = ?"
    ).bind(token).run();
  }

  return new Response("ok", {
    headers: {
      "Set-Cookie": "session=; Path=/; Max-Age=0"
    }
  });
}
