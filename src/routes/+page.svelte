<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  let exampleData = [];

  onMount(async () => {
    try {
      const response = await axios.get('http://localhost:3010/example');
      exampleData = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Dashboard Home Page" />
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-2">{exampleData}</h2>
    <p class="text-gray-700 mb-4">{exampleData}</p>
    <p class="text-gray-500">{exampleData}</p>
  </div>
</div>

<style>
  /* Please use tailwindcss predefined classes as much as possible */
</style>
