import type { Actions, PageServerLoad } from './$types';
import { searchMovies, getRecommendedMovies } from '$lib/server/omdb';

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');

  if (!query) {
    const recommendedMovies = await getRecommendedMovies();
    return {
      movies: recommendedMovies,
      query: '',
      page: 1,
      totalResults: recommendedMovies.length,
      isRecommended: true
    };
  }

  try {
    const data = await searchMovies(query, page);
    return {
      movies: data.Search,
      query,
      page,
      totalResults: parseInt(data.totalResults),
      isRecommended: false
    };
  } catch (error) {
    return {
      movies: [],
      query,
      page,
      totalResults: 0,
      error: error instanceof Error ? error.message : 'An error occurred',
      isRecommended: false
    };
  }
};
