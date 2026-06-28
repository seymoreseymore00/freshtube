export async function onRequestPost({ request, env }) {
  const db = env.DB;

  const cookie = request.headers.get("Cookie") || "";
  const token = cookie.split("session=")[1]?.split(";")[0];

  if (token) {
    await db.prepare(
      "UPDATE sessions SET is_revoked=1 WHERE session_token=?"
    ).bind(token).run();
  }

  return new Response("ok", {
    headers: {
      "Set-Cookie": "session=; Path=/; Max-Age=0"
    }
  });
}
