<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fade, fly } from 'svelte/transition';

  export let data: PageData;

  let searchInput = $page.url.searchParams.get('q') || '';
  let isSearchFocused = false;

  function handleSearch() {
    if (searchInput.trim()) {
      goto(`/?q=${encodeURIComponent(searchInput)}`);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  function nextPage() {
    const currentPage = parseInt($page.url.searchParams.get('page') || '1');
    goto(`/?q=${encodeURIComponent(searchInput)}&page=${currentPage + 1}`);
  }

  function prevPage() {
    const currentPage = parseInt($page.url.searchParams.get('page') || '1');
    if (currentPage > 1) {
      goto(`/?q=${encodeURIComponent(searchInput)}&page=${currentPage - 1}`);
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
  <!-- Hero Section -->
  <div class="relative h-[60vh] bg-black/40 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
    {#if data.isRecommended && data.movies[0]}
      <img
        src={data.movies[0].Poster !== 'N/A' ? data.movies[0].Poster : '/placeholder.png'}
        alt={data.movies[0].Title}
        class="absolute inset-0 w-full h-full object-cover opacity-60"
      />
    {/if}
    <div class="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
      <h1 class="text-5xl font-bold mb-4" in:fly="{{ y: 20, duration: 600 }}">
        {data.isRecommended ? 'Welcome to MovieTracker' : `Search Results for "${data.query}"`}
      </h1>
      {#if data.isRecommended}
        <p class="text-xl text-gray-300 mb-8" in:fly="{{ y: 20, duration: 600, delay: 200 }}">
          Discover and track your favorite movies
        </p>
      {/if}
      
      <!-- Search Bar -->
      <div class="max-w-2xl" in:fly="{{ y: 20, duration: 600, delay: 400 }}">
        <div class="relative group">
          <input
            type="text"
            bind:value={searchInput}
            on:keydown={handleKeyDown}
            on:focus={() => isSearchFocused = true}
            on:blur={() => isSearchFocused = false}
            placeholder="Search for movies..."
            class="w-full px-6 py-4 bg-gray-900/80 backdrop-blur-sm text-white border-2 border-gray-700 rounded-full
                   focus:outline-none focus:border-blue-500 transition-all duration-300
                   placeholder-gray-400 text-lg"
          />
          <button
            on:click={handleSearch}
            class="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-blue-600 hover:bg-blue-700
                   text-white rounded-full transition-colors duration-300 font-semibold"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Movies Grid Section -->
  {#if data.movies.length > 0}
    <div class="container mx-auto px-4 py-12" in:fade="{{ duration: 400 }}">
      <h2 class="text-3xl font-bold mb-8 text-white/90">
        {data.isRecommended ? 'Recommended Movies' : 'Search Results'}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {#each data.movies as movie}
          <div
            class="group relative rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300
                   hover:shadow-2xl hover:shadow-blue-500/20"
            in:fade="{{ duration: 400 }}"
          >
            <a href="/movie/{movie.imdbID}" class="block">
              <div class="relative aspect-[2/3] overflow-hidden">
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
                  alt={movie.Title}
                  class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0
                            group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full
                            group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="text-lg font-semibold text-white mb-1">{movie.Title}</h3>
                  <p class="text-gray-300 text-sm">{movie.Year}</p>
                </div>
              </div>
            </a>
          </div>
        {/each}
      </div>

      {#if !data.isRecommended}
        <div class="flex justify-center mt-12 space-x-4">
          <button
            on:click={prevPage}
            disabled={data.page === 1}
            class="px-6 py-3 text-white bg-blue-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-blue-700 transition-colors duration-300 font-semibold"
          >
            Previous
          </button>
          <span class="px-6 py-3 text-gray-300 bg-gray-800/50 rounded-full">
            Page {data.page}
          </span>
          <button
            on:click={nextPage}
            disabled={data.page * 10 >= data.totalResults}
            class="px-6 py-3 text-white bg-blue-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-blue-700 transition-colors duration-300 font-semibold"
          >
            Next
          </button>
        </div>
      {/if}
    </div>
  {:else if data.error}
    <div class="container mx-auto px-4 py-12 text-center">
      <p class="text-red-400 text-lg">{data.error}</p>
    </div>
  {:else if data.query}
    <div class="container mx-auto px-4 py-12 text-center">
      <p class="text-gray-400 text-lg">No movies found for "{data.query}"</p>
    </div>
  {/if}
</div>
