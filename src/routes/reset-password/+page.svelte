<script>
    import api from '$lib/axios';
    let email = '';
    let message = '';
  
    async function resetPassword() {
      try {
        await api.post('/auth/reset-password', { email });
        message = 'Password reset email sent! Please check your email.';
      } catch (error) {
        message = error.response.data.msg || 'Password reset failed';
      }
    }
  </script>
  
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
    <h1 class="text-2xl font-bold mb-4">Reset Password</h1>
    <input type="email" bind:value={email} placeholder="Email" class="w-full p-2 mb-4 border rounded" />
    <button class="bg-blue-500 text-white py-2 px-4 rounded shadow w-full" on:click={resetPassword}>Reset Password</button>
    <p class="mt-4">{message}</p>
  </div>
  