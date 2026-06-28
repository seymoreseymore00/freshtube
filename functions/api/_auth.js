export async function requireAdmin(request, env) {
  const db = env["freshtube-db"];

  const cookie = request.headers.get("Cookie") || "";
  const token = cookie
    .split("; ")
    .find(c => c.startsWith("session="))
    ?.split("=")[1];

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { results } = await db.prepare(`
    SELECT * FROM sessions
    WHERE session_token = ?
    AND is_revoked = 0
    AND expires_at > datetime('now')
  `).bind(token).all();

  if (results.length === 0) {
    return new Response("Unauthorized", { status: 401 });
  }

  return null;
}
