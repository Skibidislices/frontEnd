<script>
  import '../app.css';
  import '@fortawesome/fontawesome-free/css/all.css'; 
  import '@fortawesome/fontawesome-free/js/all.js'
</script>

<div class="flex flex-col h-screen justify-between bg-white relative">
  <main>
    <slot />
    <!-- here the page content of +page.svelte is loaded-->
  </main>
</div>

<style>
</style>
