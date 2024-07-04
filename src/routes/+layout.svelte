<script>
  import '@fortawesome/fontawesome-free/css/all.css';
  import '@fortawesome/fontawesome-free/js/all.js';
  import '../app.css';
</script>

<div class="flex flex-col h-screen justify-between bg-gray-100">
  <nav class="bg-blue-500 p-4 text-white">
    <div class="container mx-auto flex justify-between">
      <div>
        <h1 class="text-2xl">Dashboard</h1>
      </div>
      <div>
        <ul class="flex space-x-4">
          <li><a href="/" class="hover:underline">Home</a></li>
          <li><a href="/about" class="hover:underline">About</a></li>
        </ul>
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
