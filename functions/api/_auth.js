export async function requireUser(request, env) {
  const db = env["freshtube-db"];

  const cookie = request.headers.get("Cookie") || "";
  const token = cookie
    .split("; ")
    .find(c => c.startsWith("session="))
    ?.split("=")[1];

  if (!token) {
    return { error: "No session" };
  }

  const session = await db.prepare(`
    SELECT * FROM sessions
    WHERE session_token = ?
    AND is_revoked = 0
    AND expires_at > datetime('now')
  `).bind(token).first();

  if (!session) {
    return { error: "Invalid session" };
  }

  return session;
}

// admin helper
export async function requireAdmin(request, env) {
  const session = await requireUser(request, env);

  if (session.error) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!session.is_admin) {
    return new Response("Forbidden", { status: 403 });
  }

  return null;
}
