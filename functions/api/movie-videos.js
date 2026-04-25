export async function onRequest({ request, env }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "missing id" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${env.TMDB_API_KEY}`
    );

    const data = await res.json();

    // fallback safety
    if (!data || !data.results) {
      return new Response(
        JSON.stringify({ error: "no videos found", raw: data }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "server error", details: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
