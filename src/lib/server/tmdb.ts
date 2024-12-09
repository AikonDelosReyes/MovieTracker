import { TMDB_API_KEY } from '$env/static/private';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBResponse {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

export async function searchMovies(query: string, page = 1): Promise<TMDBResponse> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  return response.json();
}

export async function getMovieDetails(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
  );
  return response.json();
}

export async function getPopularMovies(page = 1): Promise<TMDBResponse> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.json();
}

export async function getTopRatedMovies(page = 1): Promise<TMDBResponse> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.json();
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse> {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`
  );
  return response.json();
}

export async function getMovieRecommendations(movieId: number, page = 1): Promise<TMDBResponse> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.json();
}

export function getImageUrl(path: string, size: 'w500' | 'original' = 'w500'): string {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
