<script>
  import '@fortawesome/fontawesome-free/css/all.css';
  import '@fortawesome/fontawesome-free/js/all.js';
  import '../app.css';

  import { onMount } from 'svelte';
  let showDropdown = false;

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
        <h1 class="text-2xl">ProjectNaem</h1>
      </div>
      <div class="flex items-center">
        <ul class="flex space-x-4 mr-4">
          <li><a href="/" class="hover:underline">Upload</a></li>
          <li><a href="/" class="hover:underline">Dashboard</a></li>
          <li><a href="/" class="hover:underline">Personal</a></li>
        </ul>
        <div class="relative" use:clickOutside>
          <button on:click={() => showDropdown = !showDropdown} class="focus:outline-none">
            <i class="fas fa-user-circle text-3xl"></i> <!-- Font Awesome Profile Icon -->
          </button>
          {#if showDropdown}
            <div class="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md py-1 z-50">
              <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <a href="/about" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">About</a>
              <a href="/logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log out</a>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </nav>
  <main class="flex-1 container mx-auto p-4">
    <slot />
    <!-- here the page content of +page.svelte is loaded -->
  </main>
  <footer class="bg-blue-500 p-4 text-white text-center">
    <p>&copy; 2024 Skibidi Slices</p>
  </footer>
</div>