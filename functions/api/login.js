import { sha256 } from "../utils/hash";

export async function onRequestPost({ request, env }) {
  const db = env["freshtube-db"];
  const { username, password, admin } = await request.json();

  const hash = await sha256(password);

  // ADMIN LOGIN (your existing system)
  if (admin) {
    if (password !== env.ADMIN_PASSWORD) {
      return new Response("Unauthorized", { status: 401 });
    }
  } else {
    const user = await db.prepare(
      "SELECT * FROM users WHERE username = ? AND password_hash = ?"
    ).bind(username, hash).first();

    if (!user) {
      return new Response("Invalid login", { status: 401 });
    }
  }

  const token = crypto.randomUUID();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  await db.prepare(
    `INSERT INTO sessions (session_token, user_id, is_admin, expires_at)
     VALUES (?, ?, ?, ?)`
  ).bind(
    token,
    admin ? null : user?.id,
    admin ? 1 : 0,
    expires.toISOString()
  ).run();

  return new Response("ok", {
    headers: {
      "Set-Cookie": `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    }
  });
}
