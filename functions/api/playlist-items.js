export async function onRequestGet({ request, env }) {
  const db = env["freshtube-db"];

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const { results } = await db.prepare(
    `SELECT * FROM playlist_items
     WHERE playlist_id = ?
     ORDER BY position ASC, id ASC`
  ).bind(id).all();

  return Response.json(results);
}
