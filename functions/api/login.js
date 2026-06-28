import { sha256 } from "../utils/hash";

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { username, password } = await request.json();

  const hash = await sha256(password);

  const user = await db.prepare(
    "SELECT * FROM users WHERE username=? AND password_hash=?"
  ).bind(username, hash).first();

  if (!user) return new Response("fail", { status: 401 });

  const token = crypto.randomUUID();

  await db.prepare(`
    INSERT INTO sessions (session_token, user_id, is_admin, expires_at)
    VALUES (?, ?, 0, datetime('now', '+7 days'))
  `).bind(token, user.id).run();

  return new Response("ok", {
    headers: {
      "Set-Cookie": `session=${token}; Path=/; HttpOnly; SameSite=Strict`
    }
  });
}
