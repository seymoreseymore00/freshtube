export async function onRequestPost({ request, env }) {
  const db = env["freshtube-db"];

  const { playlist_id, title, youtube_id } = await request.json();

  await db.prepare(
    `INSERT INTO user_playlist_items (playlist_id, title, youtube_id)
     VALUES (?, ?, ?)`
  ).bind(playlist_id, title, youtube_id).run();

  return Response.json({ ok: true });
}
