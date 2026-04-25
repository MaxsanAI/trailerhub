let movies = [];
let heroMovie = null;
let currentMovie = null;

async function fetchAll() {
  try {
    const res = await fetch("/api/movies");
    const data = await res.json();

    console.log("TMDB RESPONSE:", data);

    const list = data.results ?? [];

    const enriched = await Promise.all(
      list.map(async (m) => {
        const v = await fetch(
          `/api/movie-videos?id=${m.id}`
        ).catch(() => null);

        if (!v) return null;

        const vd = await v.json();

        const trailer = vd.results?.find(
          x => x.site === "YouTube" && x.type === "Trailer"
        );

        if (!trailer) return null;

        return {
          ...m,
          trailerKey: trailer.key
        };
      })
    );

    movies = enriched.filter(Boolean).slice(0, 100);

    heroMovie = movies[0];

    if (heroMovie) {
      setHero(heroMovie);
      renderMovies(movies);
    }

  } catch (err) {
    console.error("API ERROR:", err);
  }
}

function setHero(m) {
  document.querySelector(".hero").style.backgroundImage =
    `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;

  document.getElementById("heroTitle").innerText = m.title;
  document.getElementById("heroDesc").innerText = m.overview;
}

function renderMovies(list) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  list.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" />
      <div class="title">${m.title}</div>
    `;

    card.onclick = () => openPlayer(m);
    grid.appendChild(card);
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
  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(q.toLowerCase())
  );

  renderMovies(filtered);
}

fetchAll();
