import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '@sveltejs/kit';
import { getMovieById } from '$lib/server/omdb';

interface Params {
  movieId: string;
}

export const load: PageServerLoad = async ({ params }: { params: Params }) => {
  try {
    const movie = await getMovieById(params.movieId);
    return {
      movie
    };
  } catch (err) {
    throw error(404, 'Movie not found');
  }
};
