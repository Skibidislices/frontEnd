<script>
    import api from '$lib/axios';
    import { onMount } from 'svelte';
    let message = '';
  
    onMount(async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      if (token) {
        try {
          await api.get(`/auth/verify/${token}`);
          message = 'Email verified successfully!';
        } catch (error) {
          message = error.response.data.msg || 'Verification failed';
        }
      } else {
        message = 'No verification token provided';
      }
    });
  </script>
  
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
    <h1 class="text-2xl font-bold mb-4">Email Verification</h1>
    <p>{message}</p>
  </div>
  