import { sha256 } from "../utils/hash";

export async function onRequestPost({ request, env }) {
  const db = env["freshtube-db"];
  const { username, password } = await request.json();

  if (!username || !password) {
    return new Response("Missing fields", { status: 400 });
  }

  const hash = await sha256(password);

  try {
    await db.prepare(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)"
    ).bind(username, hash).run();

    return new Response("ok");
  } catch (e) {
    return new Response("Username exists", { status: 400 });
  }
}
