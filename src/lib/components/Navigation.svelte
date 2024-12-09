<script lang="ts">
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let isScrolled = false;
  let isMobileMenuOpen = false;

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 0;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function handleLogout() {
    return async () => {
      try {
        const response = await fetch('/auth/logout', {
          method: 'POST',
          headers: {
            'accept': 'application/json'
          }
        });
        
        if (response.ok) {
          await goto('/');
        } else {
          console.error('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
  }
</script>

<nav class="fixed w-full z-50 transition-all duration-300 {isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'}">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex items-center">
        <a href="/" class="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors duration-300">MovieTracker</a>
        
        <div class="hidden md:ml-8 md:flex md:space-x-6">
          <a href="/" class="inline-flex items-center px-1 py-1 text-sm font-medium text-gray-200 hover:text-white transition-colors duration-300 {$page.url.pathname === '/' ? 'border-b-2 border-red-600' : ''}">Home</a>
          {#if $page.data.user}
            <a href="/watchlist" class="inline-flex items-center px-1 py-1 text-sm font-medium text-gray-200 hover:text-white transition-colors duration-300 {$page.url.pathname === '/watchlist' ? 'border-b-2 border-red-600' : ''}">Watchlist</a>
          {/if}
        </div>
      </div>

      <div class="flex items-center md:hidden">
        <button on:click={() => isMobileMenuOpen = !isMobileMenuOpen} class="text-gray-200 hover:text-white">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {#if isMobileMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            {/if}
          </svg>
        </button>
      </div>

      <div class="hidden md:flex md:items-center md:space-x-4">
        {#if $page.data.user}
          <form method="POST" action="/auth/logout" use:enhance={handleLogout}>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors duration-300 hover:bg-red-600/10 rounded-md">Sign out</button>
          </form>
        {:else}
          <a href="/login" class="px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors duration-300 hover:bg-red-600/10 rounded-md">Sign in</a>
          <a href="/register" class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-300">Sign up</a>
        {/if}
      </div>
    </div>
  </div>

  {#if isMobileMenuOpen}
    <div class="md:hidden bg-black/95 backdrop-blur-sm" transition:fade={{ duration: 200 }}>
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a href="/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-red-600/10 transition-colors duration-300 {$page.url.pathname === '/' ? 'bg-red-600/20 text-white' : ''}">Home</a>
        {#if $page.data.user}
          <a href="/watchlist" class="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-red-600/10 transition-colors duration-300 {$page.url.pathname === '/watchlist' ? 'bg-red-600/20 text-white' : ''}">Watchlist</a>
          <form method="POST" action="/auth/logout" use:enhance={handleLogout} class="block">
            <button type="submit" class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-red-600/10 transition-colors duration-300">Sign out</button>
          </form>
        {:else}
          <a href="/login" class="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-red-600/10 transition-colors duration-300">Sign in</a>
          <a href="/register" class="block px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-300">Sign up</a>
        {/if}
      </div>
    </div>
  {/if}
</nav>

<div class="h-16"></div>
