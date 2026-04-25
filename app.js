
async function safeFetch(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      console.log("❌ INVALID JSON RESPONSE:", text);
      return null;
    }
  } catch (err) {
    console.log("❌ NETWORK ERROR:", err);
    return null;
  }
}

/* ---------------- ROW LOADER ---------------- */

async function loadRow(endpoint, id) {
  const container = document.getElementById(id);

  // loading state (NE ZAMRZAVA APP)
  container.innerHTML = "<p style='opacity:0.5'>Loading...</p>";

  const data = await safeFetch(`/api/${endpoint}`);

  // FAIL SAFE
  if (!data || !data.results) {
    container.innerHTML = "<p style='color:red'>Failed to load</p>";
    return;
  }

  container.innerHTML = "";

  data.results.forEach(item => {
    if (!item.poster_path) return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${item.poster_path}">
      <div class="card-title">${item.title || item.name || "Untitled"}</div>
    `;

    card.onclick = () => openPlayer(item);

    container.appendChild(card);
  });
}

/* ---------------- PLAYER ---------------- */

async function openPlayer(movie) {
  document.getElementById("player").classList.remove("hidden");

  document.getElementById("info").innerHTML = `
    <h2>${movie.title || movie.name}</h2>
    <p>${movie.overview || "No description available."}</p>
  `;

  const data = await safeFetch(`/api/video?id=${movie.id}`);

  let trailer = null;

  if (data && data.results) {
    trailer = data.results.find(
      v => v.site === "YouTube" && v.type === "Trailer"
    );
  }

  document.getElementById("video").innerHTML = trailer
    ? `<iframe width="100%" height="400"
        src="https://www.youtube.com/embed/${trailer.key}"
        frameborder="0"
        allowfullscreen></iframe>`
    : "<p style='color:white'>No trailer available</p>";
}

/* ---------------- CLOSE PLAYER ---------------- */

function closePlayer() {
  document.getElementById("player").classList.add("hidden");
  document.getElementById("video").innerHTML = "";
}

/* ---------------- INIT APP ---------------- */

function init() {
  loadRow("popular", "popular");
  loadRow("trending", "trending");
  loadRow("toprated", "toprated");
  loadRow("upcoming", "upcoming");
  loadRow("series", "series");
}

init();
