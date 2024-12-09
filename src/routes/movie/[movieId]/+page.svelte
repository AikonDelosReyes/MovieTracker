<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import type { OMDBMovie } from '$lib/server/omdb';

  interface PageData {
    movie: OMDBMovie;
  }

  export let data: PageData;
  const movie = data.movie;

  function goBack() {
    history.back();
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
  <!-- Hero Section -->
  <div class="relative min-h-[70vh] bg-black/40">
    <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-10"></div>
    <img
      src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
      alt={movie.Title}
      class="absolute inset-0 w-full h-full object-cover opacity-40"
    />
    
    <!-- Back Button -->
    <button
      on:click={goBack}
      class="absolute top-6 left-6 z-20 px-6 py-3 bg-black/50 hover:bg-black/70 text-white rounded-full
             transition-all duration-300 backdrop-blur-sm flex items-center gap-2 group"
      in:fly="{{ x: -20, duration: 600 }}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <!-- Movie Details -->
    <div class="relative z-20 container mx-auto px-4 py-16 flex flex-col justify-end min-h-[70vh]">
      <div class="max-w-4xl" in:fly="{{ y: 20, duration: 600 }}">
        <h1 class="text-5xl font-bold mb-4">{movie.Title}</h1>
        <div class="flex flex-wrap gap-4 text-sm text-gray-300 mb-6">
          <span>{movie.Year}</span>
          <span>•</span>
          <span>{movie.Runtime}</span>
          <span>•</span>
          <span>{movie.Genre}</span>
          {#if movie.imdbRating !== 'N/A'}
            <span>•</span>
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{movie.imdbRating}/10</span>
            </div>
          {/if}
        </div>
        <p class="text-lg text-gray-300 mb-8 leading-relaxed max-w-3xl">
          {movie.Plot}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
          <div>
            <h3 class="text-white font-semibold mb-2">Director</h3>
            <p>{movie.Director}</p>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-2">Cast</h3>
            <p>{movie.Actors}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Additional Details Section -->
  <div class="container mx-auto px-4 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" in:fade="{{ duration: 600, delay: 300 }}">
      {#if movie.Ratings && movie.Ratings.length > 0}
        <div class="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 class="text-xl font-semibold mb-4">Ratings</h3>
          <div class="space-y-4">
            {#each movie.Ratings as rating}
              <div>
                <p class="text-gray-400">{rating.Source}</p>
                <p class="text-lg font-medium">{rating.Value}</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <div class="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 class="text-xl font-semibold mb-4">Additional Info</h3>
        <div class="space-y-4">
          {#if movie.Language !== 'N/A'}
            <div>
              <p class="text-gray-400">Language</p>
              <p class="text-lg">{movie.Language}</p>
            </div>
          {/if}
          {#if movie.Country !== 'N/A'}
            <div>
              <p class="text-gray-400">Country</p>
              <p class="text-lg">{movie.Country}</p>
            </div>
          {/if}
          {#if movie.Awards !== 'N/A'}
            <div>
              <p class="text-gray-400">Awards</p>
              <p class="text-lg">{movie.Awards}</p>
            </div>
          {/if}
        </div>
      </div>

      {#if movie.Genre}
        <div class="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 class="text-xl font-semibold mb-4">Genres</h3>
          <div class="flex flex-wrap gap-2">
            {#each movie.Genre.split(', ') as genre}
              <span class="px-4 py-2 bg-blue-600/30 rounded-full text-sm">
                {genre}
              </span>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
