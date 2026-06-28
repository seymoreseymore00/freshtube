export async function onRequestGet({ request, env }) {
  const db = env.DB;

  const id = new URL(request.url).searchParams.get("id");

  const user = await db.prepare(
    "SELECT id, username, display_name, bio FROM users WHERE id=?"
  ).bind(id).first();

  return Response.json(user);
}
