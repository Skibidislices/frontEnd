<script>
  import { onMount } from 'svelte';
  import api from '$lib/axios';
  import { writable } from 'svelte/store';

  let isDragging = writable(false);
  let file = null;
  let message = '';
  let jsonData = writable({});
  let selectedSheetIndex = 0; // Added to track the selected sheet index
  let sheetsData = []; // This will hold the actual data for each sheet
  let selectedSheetData = writable({}); // This will hold the data for the selected sheet


  console.log(jsonData);

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
      sheetsData = Object.values(response.data); // Assuming the response data is an object with sheet names as keys
      message = 'File uploaded successfully';
    } catch (error) {
      message = 'Error uploading file';
      console.error('Error uploading file:', error);
    }
  }

  let jsonKeys = [];
  $: if ($jsonData) {
    jsonKeys = Object.keys($jsonData);
    console.log('Received JSON data:', jsonKeys);
  }

  // Function to handle changes in selection
  function handleSelectionChange() {
    if (sheetsData.length > selectedSheetIndex) {
      const selectedData = sheetsData[selectedSheetIndex];
      selectedSheetData.set(selectedData); // Update selectedSheetData with the selected sheet's data
    }
  }
  $: $jsonData, sheetsData = Object.values($jsonData);
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
    <label for="tables">Choose a table you want to display:</label>
    <select bind:value={selectedSheetIndex} on:change={handleSelectionChange}>
      {#if jsonKeys}
      {#each jsonKeys as item, index}
          <option value="{index}">{item}</option>
      {/each}
      {/if}
    </select>
    <!-- Displaying the selected sheet's data -->
    {#if $selectedSheetData}
      <pre>{JSON.stringify($selectedSheetData, null, 2)}</pre>
    {/if}
  {/if}
</div>