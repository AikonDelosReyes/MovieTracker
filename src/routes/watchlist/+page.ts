import type { PageLoad } from './$types';
import type { WatchlistItem } from '$lib/types';

export interface PageData {
  user: App.Locals['user'];
  watchlist: WatchlistItem[];
}

export const load: PageLoad = async () => {
  return {};
};
