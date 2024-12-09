<script lang="ts">
  import type { PageData } from './$types';
  import type { WatchlistItem, WatchlistStatus } from '$lib/types';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  
  interface WatchlistPageData extends PageData {
    watchlist: WatchlistItem[];
  }
  
  export let data: WatchlistPageData;
  let loading = false;
  let filter: WatchlistStatus | 'all' = 'all';
  let error: string | null = null;

  $: filteredWatchlist = data.watchlist.filter((item: WatchlistItem) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  async function removeFromWatchlist(movieId: string) {
    try {
      loading = true;
      const response = await fetch(`/api/watchlist/${movieId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove movie');
      await invalidateAll();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to remove movie';
    } finally {
      loading = false;
    }
  }
</script>

{#if error}
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <span class="block sm:inline">{error}</span>
    <button class="absolute top-0 bottom-0 right-0 px-4" on:click={() => error = null}>
      <span class="sr-only">Close</span>
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
{/if}

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold text-gray-900">My Watchlist</h1>
    <div class="flex gap-4">
      <select
        bind:value={filter}
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
      >
        <option value="all">All</option>
        <option value="want_to_watch">Want to Watch</option>
        <option value="watching">Watching</option>
        <option value="watched">Watched</option>
      </select>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    </div>
  {:else if filteredWatchlist.length === 0}
    <div class="text-center py-12">
      <p class="text-gray-500">No movies in your watchlist</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {#each filteredWatchlist as item (item.id)}
        <div class="bg-white rounded-lg shadow overflow-hidden">
          {#if item.movie}
            <div class="relative pb-[150%]">
              <img
                src={item.movie.poster}
                alt={item.movie.title}
                class="absolute h-full w-full object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-medium text-gray-900">{item.movie.title}</h3>
              <p class="text-sm text-gray-500">{item.movie.year}</p>
              <div class="mt-4 flex justify-between items-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  {item.status === 'want_to_watch' ? 'bg-yellow-100 text-yellow-800' :
                   item.status === 'watching' ? 'bg-blue-100 text-blue-800' :
                   'bg-green-100 text-green-800'}">
                  {item.status.replace('_', ' ')}
                </span>
                <button
                  on:click={() => removeFromWatchlist(item.movie?.id || '')}
                  class="text-red-600 hover:text-red-900"
                  disabled={loading}
                >
                  <span class="sr-only">Remove from watchlist</span>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
