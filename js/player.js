let playlist = [];
let index = 0;
let player;

const playlistId = new URLSearchParams(location.search).get("id");

async function loadPlaylist() {
  const res = await fetch(`/api/playlist-items?id=${playlistId}`);
  playlist = await res.json();

  if (playlist.length === 0) {
    document.getElementById("queue").innerHTML = "No videos yet";
    return;
  }

  loadVideo(0);
  renderQueue();
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: "",
    events: {
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.ENDED) {
          next();
        }
      }
    }
  });
}

function loadVideo(i) {
  index = i;
  player.loadVideoById(playlist[i].youtube_id);
  renderQueue();
}

function next() {
  index = (index + 1) % playlist.length;
  loadVideo(index);
}

function renderQueue() {
  document.getElementById("queue").innerHTML = playlist.map((v, i) => `
    <div style="${i === index ? 'font-weight:bold' : ''}">
      ${v.title}
    </div>
  `).join("");
}

loadPlaylist();
