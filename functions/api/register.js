import { sha256 } from "../utils/hash";

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { username, password } = await request.json();

  const hash = await sha256(password);

  await db.prepare(
    "INSERT INTO users (username, password_hash) VALUES (?, ?)"
  ).bind(username, hash).run();

  return Response.json({ ok: true });
}
