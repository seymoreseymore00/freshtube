export async function onRequestGet({ request, env }) {
  const db = env.DB;

  const id = new URL(request.url).searchParams.get("id");

  const { results } = await db.prepare(
    "SELECT * FROM playlist_items WHERE playlist_id=? ORDER BY position ASC"
  ).bind(id).all();

  return Response.json(results);
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { playlist_id, title, youtube_id } = await request.json();

  await db.prepare(
    "INSERT INTO playlist_items (playlist_id,title,youtube_id) VALUES (?,?,?)"
  ).bind(playlist_id, title, youtube_id).run();

  return Response.json({ ok: true });
}
