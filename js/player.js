let playlist = [];
let i = 0;
let player;

const id = new URLSearchParams(location.search).get("id");

fetch(`/api/playlist-items?id=${id}`)
  .then(r => r.json())
  .then(data => {
    playlist = data;
    load(0);
  });

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    events: {
      onStateChange: e => {
        if (e.data === 0) next();
      }
    }
  });
}

function load(n) {
  i = n;
  player.loadVideoById(playlist[i].youtube_id);
  render();
}

function next() {
  i = (i + 1) % playlist.length;
  load(i);
}

function render() {
  queue.innerHTML = playlist.map((v, idx) =>
    `<div>${idx === i ? "▶" : ""} ${v.title}</div>`
  ).join("");
}
