export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "missing id" }), { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${env.TMDB_API_KEY}`
    );

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "video failed", details: err.message }),
      { status: 500 }
    );
  }
}
