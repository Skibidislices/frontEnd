<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import devImg from '$lib/pics/Pic1.png';
  import devImg2 from '$lib/pics/Pic2.png';
  import devImg3 from '$lib/pics/Pic3.png';
  import devImg4 from '$lib/pics/Pic4.png';
  import { goto } from '$app/navigation';

  let showModal = false;
  let selectedImage = null;

</script>

<svelte:head>
  <title>About</title>
  <meta name="description" content="About this project" />
</svelte:head>

{#if showModal}
<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" on:click={() => showModal = false}>
  <div class="bg-white p-6 rounded shadow-md max-w-full max-h-full overflow-hidden" on:click|stopPropagation>
    <img src={selectedImage} alt="Selected Image" class="object-contain rounded-lg shadow-md" style="max-height: 90vh; width: auto;">
  </div>
</div>
{/if}

<div class="flex flex-col justify-evenly space-y-4">
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-2">About this project</h2>
    <p class="text-gray-700 mb-4">This is an application built for the 2024 Hacking By The Sea Hackathon.</p>
    <p class="text-gray-500">Built by Team 16 - <a href="https://github.com/Vanishonko">Ivan</a>, <a href="https://github.com/mvv7777">Mikhail</a>, <a href="https://github.com/g0sh06">Simeon</a> and <a href="https://github.com/Silvanbr">Silvan</a>.</p>
    <p class="text-gray-500">The project is a dashboard that provides insight into the availability and workload of both teachers and students.</p>
    <p class="text-gray-500">It is built using <a href="https://github.com/Skibidislices/frontEnd">SvelteKit</a> and <a href="https://github.com/Skibidislices/backEnd">NodeJS (ExpressJS)</a>.</p>
  </div>

  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-2">Dev Process</h2>
    <div class="flex justify-left space-x-4">
      <img src={devImg} alt="Dev Process" class="object-scale-down h-48 w-64 rounded-lg shadow-md mb-4" on:click={() => {selectedImage = devImg; showModal = true;}}>
      <img src={devImg2} alt="Dev Process" class="object-scale-down h-48 w-64 rounded-lg shadow-md mb-4" on:click={() => {selectedImage = devImg2; showModal = true;}}>
      <img src={devImg3} alt="Dev Process" class="object-scale-down h-48 w-64 rounded-lg shadow-md mb-4" on:click={() => {selectedImage = devImg3; showModal = true;}}>
      <img src={devImg4} alt="Dev Process" class="object-scale-down h-48 w-64 rounded-lg shadow-md mb-4" on:click={() => {selectedImage = devImg4; showModal = true;}}>
    </div>
  </div>

  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-2">Learning Outcomes</h2>
    <p class="text-gray-700 mb-4">TODO</p>
  </div>
</div>
<style>
  /* Please use tailwindcss predefined classes as much as possible */
</style>
