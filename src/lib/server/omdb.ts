import { OMDB_API_KEY } from '$env/static/private';

const OMDB_BASE_URL = 'http://www.omdbapi.com';

export interface OMDBMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Plot?: string;
  imdbRating?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Ratings?: Array<{ Source: string; Value: string }>;
}

export interface OMDBSearchResponse {
  Search: OMDBMovie[];
  totalResults: string;
  Response: string;
}

export async function searchMovies(query: string, page: number = 1): Promise<OMDBSearchResponse> {
  const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.Response === 'False') {
    throw new Error(data.Error || 'No movies found');
  }
  
  return data;
}

export async function getMovieById(imdbId: string): Promise<OMDBMovie> {
  const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found');
  }
  
  return data;
}

export async function getRecommendedMovies(): Promise<OMDBMovie[]> {
  // List of popular movies to recommend
  const recommendedTitles = [
    'Inception',
    'The Shawshank Redemption',
    'The Dark Knight',
    'Pulp Fiction',
    'The Matrix',
    'Forrest Gump',
    'The Godfather',
    'Interstellar'
  ];
  
  try {
    // Get details for each recommended movie
    const moviePromises = recommendedTitles.map(title => 
      searchMovies(title).then(response => response.Search[0])
    );
    
    const movies = await Promise.all(moviePromises);
    return movies.filter(movie => movie !== undefined);
  } catch (error) {
    console.error('Error fetching recommended movies:', error);
    return [];
  }
}
