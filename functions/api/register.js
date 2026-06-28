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

  await db.prepare(
    "INSERT INTO users (username, password_hash) VALUES (?, ?)"
  ).bind(username, hash).run();

  return Response.json({ ok: true });
}
