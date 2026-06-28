export async function onRequestGet({ request, env }) {
  const db = env.DB;

  const cookie = request.headers.get("Cookie") || "";
  const token = cookie.split("session=")[1]?.split(";")[0];

  if (!token) {
    return Response.json({
      loggedIn: false,
      user: {
        username: "admin",
        display_name: "Admin"
      }
    });
  }

  const session = await db.prepare(`
    SELECT users.username, users.display_name
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.session_token = ?
      AND sessions.is_revoked = 0
      AND sessions.expires_at > datetime('now')
  `).bind(token).first();

  if (!session) {
    return Response.json({
      loggedIn: false,
      user: {
        username: "admin",
        display_name: "Admin"
      }
    });
  }

  return Response.json({
    loggedIn: true,
    user: session
  });
}
