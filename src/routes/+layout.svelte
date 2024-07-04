<script >
  import '@fortawesome/fontawesome-free/css/all.css';
  import '@fortawesome/fontawesome-free/js/all.js';
  import '../app.css';
</script>

<script context="module">
  // This doesnt work todo fix
  import { checkAuth } from '$lib/auth'; 

  export const load = async ({ route }) => {
    checkAuth(route.id); // Redirect if not authenticated
    return {};
  };
</script>

<div class="flex flex-col h-screen justify-between bg-gray-100">
  <nav class="bg-blue-500 p-4 text-white shadow-md">
    <div class="container mx-auto flex justify-between">
      <div>
        <h1 class="text-2xl font-bold">Dashboard</h1>
      </div>
      <div>
        <ul class="flex space-x-4">
          <li><a href="/" class="hover:underline">Home</a></li>
          <li><a href="/register" class="hover:underline">Register</a></li>
          <li><a href="/login" class="hover:underline">Login</a></li>
          <li><a href="/reset-password" class="hover:underline">Reset Password</a></li>
        </ul>
      </div>
    </div>
  </nav>
  <main class="flex-1 container mx-auto p-4">
    <slot />
  </main>
  <footer class="bg-blue-500 p-4 text-white text-center shadow-md">
    <p>&copy; 2024 Your Company</p>
  </footer>
</div>
