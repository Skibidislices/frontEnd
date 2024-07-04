<script>
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import api from '$lib/axios';

  let isDragging = writable(false);
  let file = null;
  let message = '';
  let jsonData = writable(null);

  function handleDragOver(event) {
    event.preventDefault();
    isDragging.set(true);
  }

  function handleDragLeave(event) {
    if (event.clientX === 0 && event.clientY === 0) {
      isDragging.set(false);
    }
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

  onMount(() => {
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);
  });
</script>

<style>
  .drop-zone {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 1.5rem;
    z-index: 1000;
    transition: opacity 0.3s ease;
    opacity: 0;
    pointer-events: none;
  }
  .drop-zone.active {
    opacity: 1;
    pointer-events: all;
  }
  .hidden-input {
    display: none;
  }
  .file-list {
    margin-top: 20px;
  }
</style>

<div class="drop-zone { $isDragging ? 'active' : '' }">
  <p>Drag and drop your Excel file here</p>
  <input type="file" accept=".xlsx, .xls" class="hidden-input" on:change={e => uploadFile(e.target.files[0])} />
</div>

<p>{message}</p>

<div class="file-list">
  {#if $jsonData}
    <h3>Uploaded Data:</h3>
    <pre>{JSON.stringify($jsonData, null, 2)}</pre>
  {/if}
</div>
