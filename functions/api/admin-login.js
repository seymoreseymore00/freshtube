export async function onRequestPost({ request, env }) {
  const db = env.DB;

  const { username, password } = await request.json();

  // simple admin check (you can improve later)
  const admin = await db.prepare(
    "SELECT * FROM users WHERE username = ?"
  ).bind(username).first();

  if (!admin) {
    return new Response("Invalid admin", { status: 401 });
  }

  const hashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );

  const hash = [...new Uint8Array(hashBuf)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  if (admin.password_hash !== hash) {
    return new Response("Wrong password", { status: 401 });
  }

  // IMPORTANT: must be marked admin
  const token = crypto.randomUUID();

  await db.prepare(
    `INSERT INTO sessions (session_token, user_id, is_admin, expires_at)
     VALUES (?, ?, 1, datetime('now','+7 days'))`
  ).bind(token, admin.id).run();

  return new Response("ok", {
    headers: {
      "Set-Cookie": `session=${token}; Path=/; HttpOnly; SameSite=Strict`
    }
  });
}
