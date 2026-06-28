export async function onRequestGet({ env }) {
  const db = env.DB;

  const { results } = await db.prepare(
    "SELECT * FROM playlists ORDER BY id DESC"
  ).all();

  return Response.json(results);
}
