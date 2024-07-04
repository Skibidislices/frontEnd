<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  let exampleData = '';

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
  <title>About</title>
  <meta name="description" content="About this project" />
</svelte:head>

<div class="bg-white p-6 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-2">About this project</h2>
  <p class="text-gray-700 mb-4">This is an application built for the 2024 Hacking By The Sea Hackathon.</p>
  <p class="text-gray-500">It's built by Team 16 - Ivan, Mikhail, Simeon and Silvan.</p>
  <p class="text-gray-500">The project is a dashboard that provides insight into the availability and workload of both teachers and students.</p>
  <p class="text-gray-500">It is built using SvelteKit and NodeJS (ExpressJS).</p>
</div>

<style>
  /* Please use tailwindcss predefined classes as much as possible */
</style>
