export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/", "");

  const TMDB = "https://api.themoviedb.org/3";

  try {
    let tmdbPath = null;

    if (path === "popular") tmdbPath = "/movie/popular";
    if (path === "trending") tmdbPath = "/trending/all/day";
    if (path === "toprated") tmdbPath = "/movie/top_rated";
    if (path === "upcoming") tmdbPath = "/movie/upcoming";
    if (path === "series") tmdbPath = "/tv/popular";

    if (path === "video") {
      const id = url.searchParams.get("id");
      if (!id) {
        return json({ error: "missing id" }, 400);
      }

      const res = await fetch(
        `${TMDB}/movie/${id}/videos?api_key=${env.TMDB_API_KEY}`
      );

      return new Response(await res.text(), {
        headers: jsonHeaders()
      });
    }

    if (!tmdbPath) {
      return json({ error: "route not found: " + path }, 404);
    }

    const res = await fetch(
      `${TMDB}${tmdbPath}?api_key=${env.TMDB_API_KEY}`
    );

    const text = await res.text();

    return new Response(text, {
      headers: jsonHeaders()
    });

  } catch (err) {
    return json({ error: "server error", details: err.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: jsonHeaders()
  });
}

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };
}
