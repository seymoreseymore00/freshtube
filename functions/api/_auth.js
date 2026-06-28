export async function requireAdmin(request, env) {
  const db = env.DB;

  const cookie = request.headers.get("Cookie") || "";
  const token = cookie.split("session=")[1]?.split(";")[0];

  if (!token) return new Response("Unauthorized", { status: 401 });

  const session = await db.prepare(`
    SELECT * FROM sessions
    WHERE session_token = ?
    AND is_revoked = 0
    AND expires_at > datetime('now')
  `).bind(token).first();

  if (!session || session.is_admin !== 1) {
    return new Response("Forbidden", { status: 403 });
  }

  return null;
}
