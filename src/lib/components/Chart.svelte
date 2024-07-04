<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import Chart from 'chart.js/auto';

  export let type;
  export let data;
  export let options;

  let canvas;
  let chartInstance;

  onMount(() => {
    chartInstance = new Chart(canvas, {
      type,
      data,
      options,
    });

  });

  onDestroy(() => {
    chartInstance.destroy();
  });

  afterUpdate(() => {
    if (chartInstance) {
      chartInstance.config.type = type;
      chartInstance.config.data = data;
      chartInstance.config.options = options;
      chartInstance.update();
    }
  });
</script>

<canvas bind:this={canvas}></canvas>
