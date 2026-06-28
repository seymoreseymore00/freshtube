export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { username, password } = await request.json();

  const hashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );

  const hash = [...new Uint8Array(hashBuf)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  const user = await db.prepare(
    "SELECT * FROM users WHERE username=? AND password_hash=?"
  ).bind(username, hash).first();

  if (!user) {
    return new Response("Invalid login", { status: 401 });
  }

  const token = crypto.randomUUID();

  await db.prepare(
    `INSERT INTO sessions (session_token, user_id, is_admin, expires_at)
     VALUES (?, ?, 0, datetime('now','+7 days'))`
  ).bind(token, user.id).run();

  return new Response("ok", {
    headers: {
      "Set-Cookie": `session=${token}; Path=/; HttpOnly; SameSite=Strict`
    }
  });
}
