export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface WatchlistMovie {
  id: string;
  title: string;
  year: string;
  poster: string;
}

export type WatchlistStatus = 'want_to_watch' | 'watching' | 'watched';

export interface WatchlistItem {
  id: string;
  status: WatchlistStatus;
  progress: number;
  movie: WatchlistMovie | null;
}

export interface PageData {
  user: App.Locals['user'];
}
