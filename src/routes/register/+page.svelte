<script>
    import api from '$lib/axios';
    let email = '';
    let password = '';
    let message = '';
  
    async function register() {
      try {
        const response = await api.post('/auth/register', { email, password });
        message = 'Registration successful! Please check your email for verification link.';
      } catch (error) {
        message = error.response.data.msg || 'Registration failed';
      }
    }
  </script>
  
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
    <h1 class="text-2xl font-bold mb-4">Register</h1>
    <input type="email" bind:value={email} placeholder="Email" class="w-full p-2 mb-4 border rounded" />
    <input type="password" bind:value={password} placeholder="Password" class="w-full p-2 mb-4 border rounded" />
    <button class="bg-blue-500 text-white py-2 px-4 rounded shadow w-full" on:click={register}>Register</button>
    <p class="mt-4">{message}</p>
  </div>
  