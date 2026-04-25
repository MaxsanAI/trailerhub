const API_KEY = "YOUR_TMDB_API_KEY";
const BASE = "https://api.themoviedb.org/3";

let allMovies = [];
let heroMovie = null;
let currentMovie = null;

async function fetchAll() {

  const [trending, latest, top] = await Promise.all([
    fetch(`${BASE}/movie/popular?api_key=${API_KEY}`).then(r => r.json()),
    fetch(`${BASE}/movie/now_playing?api_key=${API_KEY}`).then(r => r.json()),
    fetch(`${BASE}/movie/top_rated?api_key=${API_KEY}`).then(r => r.json())
  ]);

  const merge = [...trending.results, ...latest.results, ...top.results];

  const enriched = await Promise.all(
    merge.map(async (m) => {

      const v = await fetch(`${BASE}/movie/${m.id}/videos?api_key=${API_KEY}`);
      const vd = await v.json();

      const trailer = vd.results.find(
        x => x.site === "YouTube" && x.type === "Trailer"
      );

      if (!trailer) return null;

      return {
        ...m,
        trailerKey: trailer.key
      };
    })
  );

  allMovies = enriched.filter(Boolean).slice(0, 100);

  heroMovie = allMovies[0];
  setHero(heroMovie);

  renderSections();
}

function setHero(m) {
  document.querySelector(".hero").style.backgroundImage =
    `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;

  document.getElementById("heroTitle").innerText = m.title;
  document.getElementById("heroDesc").innerText = m.overview;
}

function renderSections() {

  renderRow("trending", allMovies.slice(0, 20));
  renderRow("latest", allMovies.slice(20, 40));
  renderRow("top", allMovies.slice(40, 60));
}

function renderRow(id, list) {

  const row = document.getElementById(id);
  row.innerHTML = "";

  list.forEach(m => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${m.poster_path}" />
      <div class="title">${m.title}</div>
    `;

    card.onclick = () => openPlayer(m);

    row.appendChild(card);
  });
}

function openHero() {
  openPlayer(heroMovie);
}

function openPlayer(m) {
  currentMovie = m;

  document.getElementById("player").classList.remove("hidden");

  document.getElementById("video").innerHTML = `
    <iframe width="100%" height="500"
      src="https://www.youtube.com/embed/${m.trailerKey}?autoplay=1"
      allowfullscreen></iframe>
  `;

  document.getElementById("info").innerHTML = `
    <h2>${m.title}</h2>
    <p>${m.overview}</p>
  `;
}

function closePlayer() {
  document.getElementById("player").classList.add("hidden");
}

function searchMovies(q) {
  const filtered = allMovies.filter(m =>
    m.title.toLowerCase().includes(q.toLowerCase())
  );

  renderRow("trending", filtered);
  renderRow("latest", filtered);
  renderRow("top", filtered);
}

fetchAll();
