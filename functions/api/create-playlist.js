export async function onRequestPost({ request, env }) {
  const db = env["freshtube-db"];

  const cookie = request.headers.get("Cookie") || "";
  const token = cookie.split("; ")
    .find(c => c.startsWith("session="))
    ?.split("=")[1];

  const session = await db.prepare(
    "SELECT * FROM sessions WHERE session_token = ? AND is_revoked = 0"
  ).bind(token).first();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { name, description } = await request.json();

  await db.prepare(
    `INSERT INTO user_playlists (user_id, name, description)
     VALUES (?, ?, ?)`
  ).bind(session.user_id, name, description).run();

  return Response.json({ ok: true });
}
