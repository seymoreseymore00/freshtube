export async function onRequestGet({ env }) {
  const db = env["freshtube-db"];
  const { results } = await db.prepare("SELECT * FROM playlists").all();
  return Response.json(results);
}
