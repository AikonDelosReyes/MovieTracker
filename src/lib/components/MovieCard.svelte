<script lang="ts">
  import { getImageUrl } from '$lib/server/tmdb';
  import type { Movie } from '$lib/types';
  
  export let movie: Movie;
</script>

<div class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
  <a href="/movie/{movie.id}" class="block">
    {#if movie.poster_path}
      <img
        src={getImageUrl(movie.poster_path, 'w500')}
        alt={movie.title}
        class="w-full h-[300px] object-cover"
      />
    {:else}
      <div class="w-full h-[300px] bg-gray-200 flex items-center justify-center">
        <span class="text-gray-400">No image available</span>
      </div>
    {/if}
    
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 truncate">{movie.title}</h3>
      <div class="mt-1 flex items-center justify-between">
        <span class="text-sm text-gray-500">
          {new Date(movie.release_date).getFullYear()}
        </span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {movie.vote_average.toFixed(1)}
        </span>
      </div>
    </div>
  </a>
</div>
