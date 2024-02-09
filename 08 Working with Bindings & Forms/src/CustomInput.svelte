<script>
  export let val;
  export let val_2

  export function empty() {
    val = '';
  }
</script>

<input type="text" bind:value={val} bind:this={val_2}/>
