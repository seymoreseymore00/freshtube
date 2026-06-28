export async function onRequestPost({ request, env }) {
  const db = env["freshtube-db"];
  const { password } = await request.json();

  if (password !== env.ADMIN_PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = crypto.randomUUID();

  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  await db.prepare(
    "INSERT INTO sessions (session_token, expires_at) VALUES (?, ?)"
  ).bind(token, expires.toISOString()).run();

  return new Response("ok", {
    headers: {
      "Set-Cookie": `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    }
  });
}
