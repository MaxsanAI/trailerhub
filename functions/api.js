const TMDB = "https://api.themoviedb.org/3";

async function tmdb(path, key) {
  const res = await fetch(`${TMDB}${path}?api_key=${key}`);
  return await res.text(); // stabilno (ne puca JSON parser)
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const route = url.pathname.replace("/api/", "");

  try {

    // 🎬 POPULAR MOVIES
    if (route === "popular") {
      const data = await tmdb("/movie/popular", env.TMDB_API_KEY);
      return new Response(data, { headers: json() });
    }

    // 🔥 TRENDING
    if (route === "trending") {
      const data = await tmdb("/trending/all/day", env.TMDB_API_KEY);
      return new Response(data, { headers: json() });
    }

    // ⭐ TOP RATED
    if (route === "toprated") {
      const data = await tmdb("/movie/top_rated", env.TMDB_API_KEY);
      return new Response(data, { headers: json() });
    }

    // 🚀 UPCOMING
    if (route === "upcoming") {
      const data = await tmdb("/movie/upcoming", env.TMDB_API_KEY);
      return new Response(data, { headers: json() });
    }

    // 📺 SERIES
    if (route === "series") {
      const data = await tmdb("/tv/popular", env.TMDB_API_KEY);
      return new Response(data, { headers: json() });
    }

    // 🎥 VIDEOS
    if (route === "video") {
      const id = url.searchParams.get("id");

      if (!id) {
        return jsonResponse({ error: "missing id" }, 400);
      }

      const data = await tmdb(`/movie/${id}/videos`, env.TMDB_API_KEY);
      return new Response(data, { headers: json() });
    }

    return jsonResponse({ error: "not found" }, 404);

  } catch (e) {
    return jsonResponse({ error: "server crash", details: e.message }, 500);
  }
}

function json() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: json()
  });
}
