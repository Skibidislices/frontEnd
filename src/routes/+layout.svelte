<script>
  import '@fortawesome/fontawesome-free/css/all.css';
  import '@fortawesome/fontawesome-free/js/all.js';
  import '../app.css';

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/authStore';
  import { getUserInfo, userEmail } from '$lib/auth';
  import { page } from '$app/stores';

  let showDropdown = false;
  let isAuthenticated;

  authStore.subscribe(value => { isAuthenticated = value; });

  onMount(() => {
    getUserInfo($page.url.pathname);
    isAuthenticated = !!localStorage.getItem('token');
  });

  // Logout function
  function logout(event) {
    event.preventDefault(); // Prevent default anchor behavior
    authStore.setToken(null); // Set auth store to false
    goto('/login'); // Redirect to login page
  }

  // Custom action to detect click outside
  function clickOutside(node) {
    const handleClick = event => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        showDropdown = false;
      }
    };

    document.addEventListener('click', handleClick);

    return {
      destroy() {
        document.removeEventListener('click', handleClick);
      }
    };
  }
</script>

<div class="flex flex-col h-screen justify-between bg-gray-100">
  <nav class="bg-blue-500 p-4 text-white">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <h1 class="text-2xl"><a href="/">ProjectName</a></h1>
      </div>
      <div class="flex items-center">
        <ul class="flex space-x-4 mr-4">
          {#if !isAuthenticated}
          <li><a href="/register" class="hover:underline">Register</a></li>
          <li><a href="/login" class="hover:underline">Login</a></li>
          <li><a href="/reset-password" class="hover:underline">Reset Password</a></li>
          <li><a href="/about" class="hover:underline">About</a>
          </li>
          {/if}
          {#if isAuthenticated}
          <li><a href="/" class="hover:underline">Dashboard</a></li>
          <li><a href="/personal" class="hover:underline">Personal</a></li>
          <li><a href="/about" class="hover:underline">About</a>
          {/if}
        </ul>
        {#if isAuthenticated}
        <div class="relative" use:clickOutside>
          <button on:click={() => showDropdown = !showDropdown} class="focus:outline-none">
            <i class="fas fa-user-circle text-3xl"></i> <!-- Font Awesome Profile Icon -->
          </button>
          {#if showDropdown}
            <div class="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md py-1 z-50">
              <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <a href="/login" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" on:click|preventDefault={logout}>Log out</a>
            </div>
          {/if}
        </div>
        {/if}
      </div>
    </div>
  </nav>
  <main class="flex-1 container mx-auto p-4">
    <slot />
  </main>
  <footer class="bg-blue-500 p-4 text-white text-center">
    <p>&copy; 2024 Skibidi Slices</p>
  </footer>
</div>
