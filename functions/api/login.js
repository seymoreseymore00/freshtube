export async function onRequestPost({ request, env }) {
  const db = env.DB;

  try {
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
      return new Response("Invalid credentials", { status: 401 });
    }

    const token = crypto.randomUUID();

    await db.prepare(`
      INSERT INTO sessions (session_token, user_id, expires_at)
      VALUES (?, ?, datetime('now','+7 days'))
    `).bind(token, user.id).run();

    return new Response("ok", {
      headers: {
        "Set-Cookie": `session=${token}; Path=/; HttpOnly; SameSite=Strict`
      }
    });

  } catch (err) {
    return new Response("Login error: " + err.message, { status: 500 });
  }
}
