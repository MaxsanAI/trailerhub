async function safeFetch(url) {
  const res = await fetch(url);
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("BAD RESPONSE:", text);
    return null;
  }
}

async function loadRow(endpoint, id) {
  const data = await safeFetch(`/api/${endpoint}`);

  if (!data || !data.results) return;

  const container = document.getElementById(id);
  container.innerHTML = "";

  data.results.forEach(item => {
    if (!item.poster_path) return;

    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${item.poster_path}">
      <div class="card-title">${item.title || item.name}</div>
    `;

    el.onclick = () => openPlayer(item);
    container.appendChild(el);
  });
}

async function openPlayer(movie) {
  const data = await safeFetch(`/api/video?id=${movie.id}`);

  let trailer = null;

  if (data?.results) {
    trailer = data.results.find(v => v.site === "YouTube" && v.type === "Trailer");
  }

  document.getElementById("player").classList.remove("hidden");

  document.getElementById("info").innerHTML = `
    <h2>${movie.title}</h2>
    <p>${movie.overview || ""}</p>
  `;

  document.getElementById("video").innerHTML = trailer
    ? `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`
    : "<p>No trailer</p>";
}

function closePlayer() {
  document.getElementById("player").classList.add("hidden");
}

// INIT
loadRow("popular", "popular");
loadRow("trending", "trending");
loadRow("toprated", "toprated");
loadRow("upcoming", "upcoming");
loadRow("series", "series");
