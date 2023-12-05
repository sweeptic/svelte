<script>
  import CustomInput from './CustomInput.svelte';
  import Toggle from './Toggle.svelte';
  let value = 'Max';
  let selectedOption = 1;

  $: console.log(value);
  $: console.log(selectedOption);

  function setValue(event) {
    value = event.target.value;
  }
</script>

<!-- <input type="text" {value} on:input={setValue} /> -->
<!-- <input type="text" bind:value={value} /> -->
<!-- <input type="text" bind:value /> -->

<CustomInput bind:val={value} />

<Toggle bind:chosenOption={selectedOption} />

<h1>Bindings & Forms</h1>
