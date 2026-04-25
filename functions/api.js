export async function onRequest({ request, env }) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${env.TMDB_API_KEY}`
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
      JSON.stringify({ error: "API failed", details: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
