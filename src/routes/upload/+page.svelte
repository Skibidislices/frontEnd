<script>
  import { onMount } from 'svelte';
  import api from '$lib/axios';
  import { writable } from 'svelte/store';

  let isDragging = writable(false);
  let file = null;
  let message = '';
  let jsonData = writable(null);

  function handleDragOver(event) {
    event.preventDefault();
    isDragging.set(true);
  }

  function handleDragLeave() {
    isDragging.set(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    isDragging.set(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      file = files[0];
      uploadFile(file);
    }
  }

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      jsonData.set(response.data);
      message = 'File uploaded successfully';
    } catch (error) {
      message = 'Error uploading file';
      console.error('Error uploading file:', error);
    }
  }

  $: jsonData.subscribe(data => {
    if (data) {
      console.log('Received JSON data:', data);
    }
  });
</script>

<style>
  .drop-zone {
    border: 2px dashed #cccccc;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    transition: background-color 0.3s ease;
  }
  .drop-zone.dragging {
    background-color: #f0f0f0;
  }
  .file-list {
    margin-top: 20px;
  }
</style>

<div 
  class="drop-zone { $isDragging ? 'dragging' : '' }"
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
>
  <p>Drag and drop your Excel file here, or click to select file</p>
  <input type="file" accept=".xlsx, .xls" on:change={e => uploadFile(e.target.files[0])} style="display: none;" />
</div>

<p>{message}</p>

<div class="file-list">
  {#if $jsonData}
    <h3>Uploaded Data:</h3>
    {#each $jsonData as item}
    <div class="bg-blue-500 p-4 text-white m-1 rounded-lg">
      <p>Name: {item.full_name}</p>
      <p>Email: {item.email}</p>
      <details>
        <summary>Availability</summary>
        <div class="space-y-2">
          <p class="{item.Monday === 'yes' ? 'text-lime-400' : 'text-red-800'}">Monday: {item.Monday}</p>
          <p class="{item.Tuesday === 'yes' ? 'text-lime-400' : 'text-red-800'}">Tuesday: {item.Tuesday}</p>
          <p class="{item.wednesday === 'yes' ? 'text-lime-400' : 'text-red-800'}">Wednesday: {item.wednesday}</p>
          <p class="{item.Thursday === 'yes' ? 'text-lime-400' : 'text-red-800'}">Thursday: {item.Thursday}</p>
          <p class="{item.Friday === 'yes' ? 'text-lime-400' : 'text-red-800'}">Friday: {item.Friday}</p>
          <p class="{item.Saturday === 'yes' ? 'text-lime-400' : 'text-red-800'}">Saturday: {item.Saturday}</p>
          <p class="{item.Sunday === 'yes' ? 'text-lime-400' : 'text-red-800'}">Sunday: {item.Sunday}</p>
        </div>
      </details>
    </div>
    {/each}
  {/if}
</div>
