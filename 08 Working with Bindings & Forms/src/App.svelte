<script>
  import CustomInput from './CustomInput.svelte';
  import Toggle from './Toggle.svelte';
  let value = 'Max';
  let selectedOption = 1;
  let price = 0;

  $: console.log(value);
  $: console.log(selectedOption);
  $: console.log(price);

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

<input
  type="number"
  value={price}
  on:input={(event) => console.log(event.target.value)}
/>

<!-- convert to number -->
<input type="number" bind:value={price} />
