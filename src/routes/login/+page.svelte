<script>
    import api from '$lib/axios';
    import { goto } from '$app/navigation';
    let email = '';
    let password = '';
    let message = '';
  
    async function login() {
      try {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        message = 'Login successful!';
        goto('/');
      } catch (error) {
        message = error.response.data.msg || 'Login failed';
      }
    }
  </script>
  
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
    <h1 class="text-2xl font-bold mb-4">Login</h1>
    <input type="email" bind:value={email} placeholder="Email" class="w-full p-2 mb-4 border rounded" />
    <input type="password" bind:value={password} placeholder="Password" class="w-full p-2 mb-4 border rounded" />
    <button class="bg-blue-500 text-white py-2 px-4 rounded shadow w-full" on:click={login}>Login</button>
    <p class="mt-4">{message}</p>
  </div>
  