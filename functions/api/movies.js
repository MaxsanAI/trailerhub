export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${env.TMDB_API_KEY}&page=${page}`
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
      JSON.stringify({ error: "movies failed", details: err.message }),
      { status: 500 }
    );
  }
}
