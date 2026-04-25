const API_KEY = "YOUR_TMDB_API_KEY";
const BASE = "https://api.themoviedb.org/3";

let movies = [];
let currentMovie = null;

async function fetchMovies() {
  const res = await fetch(`${BASE}/movie/popular?api_key=${API_KEY}`);
  const data = await res.json();

  const filtered = await Promise.all(
    data.results.map(async (m) => {
      const vids = await fetch(`${BASE}/movie/${m.id}/videos?api_key=${API_KEY}`);
      const vdata = await vids.json();

      const trailer = vdata.results.find(
        v => v.type === "Trailer" && v.site === "YouTube"
      );

      if (!trailer) return null;

      return {
        ...m,
        trailerKey: trailer.key
      };
    })
  );

  movies = filtered.filter(Boolean).slice(0, 100);
  renderMovies(movies);
}

function renderMovies(list) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  list.forEach(m => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" />
      <h3>${m.title}</h3>
      <p>⭐ ${m.vote_average}</p>
    `;

    el.onclick = () => openPlayer(m);
    grid.appendChild(el);
  });
}

function openPlayer(movie) {
  currentMovie = movie;

  document.getElementById("player").classList.remove("hidden");

  document.getElementById("video").innerHTML = `
    <iframe width="100%" height="400"
      src="https://www.youtube.com/embed/${movie.trailerKey}"
      frameborder="0" allowfullscreen></iframe>
  `;

  document.getElementById("info").innerHTML = `
    <h2>${movie.title}</h2>
    <p>${movie.overview}</p>
  `;

  loadLikes();
  loadComments();
}

function closePlayer() {
  document.getElementById("player").classList.add("hidden");
}

function likeMovie() {
  const key = "likes_" + currentMovie.id;
  let likes = localStorage.getItem(key) || 0;
  likes++;
  localStorage.setItem(key, likes);
  loadLikes();
}

function loadLikes() {
  const key = "likes_" + currentMovie.id;
  document.getElementById("likes").innerText =
    localStorage.getItem(key) || 0;
}

function addComment() {
  const input = document.getElementById("commentInput");
  const key = "comments_" + currentMovie.id;

  let comments = JSON.parse(localStorage.getItem(key) || "[]");
  comments.push(input.value);

  localStorage.setItem(key, JSON.stringify(comments));
  input.value = "";

  loadComments();
}

function loadComments() {
  const key = "comments_" + currentMovie.id;
  let comments = JSON.parse(localStorage.getItem(key) || "[]");

  document.getElementById("commentList").innerHTML =
    comments.map(c => `<p>${c}</p>`).join("");
}

function searchMovies(q) {
  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(q.toLowerCase())
  );
  renderMovies(filtered);
}

function filterGenre(id) {
  if (id === "popular") return renderMovies(movies);

  const filtered = movies.filter(m =>
    m.genre_ids.includes(parseInt(id))
  );

  renderMovies(filtered);
}

fetchMovies();
