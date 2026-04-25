const API_KEY = "YOUR_TMDB_KEY";

async function loadRow(url, id) {
  const res = await fetch(url);
  const data = await res.json();

  const container = document.getElementById(id);
  container.innerHTML = "";

  data.results.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" />
      <div class="card-title">${item.title || item.name}</div>
    `;

    card.onclick = () => openPlayer(item);
    container.appendChild(card);
  });
}

function init() {
  loadRow(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`, "trending");
  loadRow(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`, "popular");
  loadRow(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`, "toprated");
  loadRow(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`, "upcoming");
  loadRow(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`, "series");
}

init();

function openPlayer(item) {
  document.getElementById("player").classList.remove("hidden");
  document.getElementById("info").innerText = item.title || item.name;
}

function closePlayer() {
  document.getElementById("player").classList.add("hidden");
}
