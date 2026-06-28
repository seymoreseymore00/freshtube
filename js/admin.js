
async function loadPlaylists() {
  const res = await fetch("/api/playlists");
  const data = await res.json();

  playlist.innerHTML = data.map(p =>
    `<option value="${p.id}">${p.name}</option>`
  ).join("");
}

async function loadItems() {
  const res = await fetch(`/api/playlist-items?id=${playlist.value}`);
  const data = await res.json();

  list.innerHTML = data.map(v => `
    <div>
      ${v.title}
      <button onclick="del(${v.id})">Delete</button>
    </div>
  `).join("");
}

async function add() {
  await fetch("/api/playlist-items", {
    method: "POST",
    body: JSON.stringify({
      playlist_id: playlist.value,
      title: title.value,
      youtube_id: yt.value
    })
  });

  loadItems();
}

async function del(id) {
  await fetch("/api/playlist-items", {
    method: "DELETE",
    body: JSON.stringify({ id })
  });

  loadItems();
}

playlist.onchange = loadItems;

loadPlaylists().then(loadItems);

async function logout() {
  await fetch("/api/logout", { method: "POST" });
  location.href = "/login.html";
}
