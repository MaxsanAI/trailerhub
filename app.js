async function loadMovies() {
  const res = await fetch("/movie");
  const data = await res.json();

  if (!data.results) {
    console.log("API ERROR:", data);
    return;
  }

  const container = document.getElementById("popular");
  container.innerHTML = "";

  data.results.forEach(movie => {
    if (!movie.poster_path) return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
      <div class="card-title">${movie.title}</div>
    `;

    card.onclick = () => openPlayer(movie);

    container.appendChild(card);
  });
}

function openPlayer(movie) {
  document.getElementById("player").classList.remove("hidden");
  document.getElementById("info").innerHTML = `
    <h2>${movie.title}</h2>
    <p>${movie.overview || "No description"}</p>
  `;
}

function closePlayer() {
  document.getElementById("player").classList.add("hidden");
}

loadMovies();
