export async function onRequestGet({ request, env }) {
  const db = env.DB;

  const page = parseInt(new URL(request.url).searchParams.get("page") || "1");
  const limit = 10;
  const offset = (page - 1) * limit;

  const count = await db.prepare(
    "SELECT COUNT(*) as c FROM users"
  ).first();

  const { results } = await db.prepare(`
    SELECT id, username, display_name, created_at
    FROM users
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  return Response.json({
    users: results,
    totalPages: Math.ceil(count.c / limit),
    page
  });
}
