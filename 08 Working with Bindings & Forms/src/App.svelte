<script>
  let value = 'Max';

  $: console.log(value);

  function setValue(event) {
    value = event.target.value;
  }
</script>

<input type="text" {value} on:input={setValue} />
<!-- <input type="text" bind:value={value} /> -->
<input type="text" bind:value />

<h1>Bindings & Forms</h1>
