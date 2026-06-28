export async function onRequestGet({ request, env }) {
  const db = env["freshtube-db"];

  const id = new URL(request.url).searchParams.get("id");

  const user = await db.prepare(
    "SELECT id, username, display_name, bio, avatar_url FROM users WHERE id = ?"
  ).bind(id).first();

  const playlists = await db.prepare(
    "SELECT * FROM user_playlists WHERE user_id = ? AND is_public = 1"
  ).bind(id).all();

  return Response.json({
    ...user,
    playlists: playlists.results
  });
}
