const TMDB = "https://api.themoviedb.org/3";

async function fetchTMDB(path, key) {
  const res = await fetch(`${TMDB}${path}?api_key=${key}`);
  const text = await res.text();

  return text; // NE JSON.parse ovde → sigurnije
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const route = url.pathname.replace("/api/", "");

  try {
    let result;

    if (route === "popular") {
      result = await fetchTMDB("/movie/popular", env.TMDB_API_KEY);
    }

    if (route === "trending") {
      result = await fetchTMDB("/trending/all/day", env.TMDB_API_KEY);
    }

    if (route === "toprated") {
      result = await fetchTMDB("/movie/top_rated", env.TMDB_API_KEY);
    }

    if (route === "upcoming") {
      result = await fetchTMDB("/movie/upcoming", env.TMDB_API_KEY);
    }

    if (route === "series") {
      result = await fetchTMDB("/tv/popular", env.TMDB_API_KEY);
    }

    if (route === "video") {
      const id = url.searchParams.get("id");
      if (!id) {
        return json({ error: "missing id" }, 400);
      }

      result = await fetchTMDB(`/movie/${id}/videos`, env.TMDB_API_KEY);
    }

    if (!result) {
      return json({ error: "route not found" }, 404);
    }

    return new Response(result, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (e) {
    return json({ error: "server crash", details: e.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
