let playlist = [];
let index = 0;
let player;

const id = new URLSearchParams(location.search).get("id");

async function load() {
  const res = await fetch(`/api/playlist-items?id=${id}`);
  playlist = await res.json();

  loadVideo(0);
  render();
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    events: {
      onStateChange: e => {
        if (e.data === YT.PlayerState.ENDED) next();
      }
    }
  });
}

function loadVideo(i) {
  index = i;
  player.loadVideoById(playlist[i].youtube_id);
}

function next() {
  index = (index + 1) % playlist.length;
  loadVideo(index);
  render();
}

function render() {
  queue.innerHTML = playlist.map((v,i)=>`
    <div>${i===index?"▶":""} ${v.title}</div>
  `).join("");
}

load();
