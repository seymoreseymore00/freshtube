export async function onRequestPost({ request, env }) {
  const db = env.DB;

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response("Missing fields", { status: 400 });
    }

    const hashBuf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(password)
    );

    const hash = [...new Uint8Array(hashBuf)]
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    await db.prepare(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)"
    ).bind(username, hash).run();

    return Response.json({ ok: true });

  } catch (err) {
    return new Response("Register error: " + err.message, { status: 500 });
  }
}
