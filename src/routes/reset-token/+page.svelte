<script>
    import axios from 'axios';
    import { onMount } from 'svelte';
    let password = '';
    let message = '';
    let token = '';
  
    onMount(() => {
      const params = new URLSearchParams(location.search);
      token = params.get('token');
    });
  
    async function resetPassword() {
      try {
        await axios.post(`http://localhost:3010/auth/reset-password/${token}`, { password });
        message = 'Password reset successful! You can now log in with your new password.';
      } catch (error) {
        message = error.response.data.msg || 'Password reset failed';
      }
    }
  </script>
  
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
    <h1 class="text-2xl font-bold mb-4">Reset Password</h1>
    <input type="password" bind:value={password} placeholder="New Password" class="w-full p-2 mb-4 border rounded" />
    <button class="bg-blue-500 text-white py-2 px-4 rounded shadow w-full" on:click={resetPassword}>Reset Password</button>
    <p class="mt-4">{message}</p>
  </div>
  