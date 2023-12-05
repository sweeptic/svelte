<script>
  import CustomInput from './CustomInput.svelte';
  import Toggle from './Toggle.svelte';
  let value = 'Max';
  let selectedOption = 1;
  let price = 0;
  let agreed;
  let color = 'red';
  let colorOptions = '';

  $: console.log(value);
  $: console.log(selectedOption);
  $: console.log(price);
  $: console.log(agreed);
  $: console.log(color);
  $: console.log(colorOptions);

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

<label>
  <input type="checkbox" name="" id="" bind:checked={agreed} />
  Agree to terms?
</label>

<h1>FAVORITE COLOR</h1>
<label>
  <input type="radio" name="color" value="red" bind:group={color} />
  Red
</label>
<label>
  <input type="radio" name="color" value="green" bind:group={color} />
  Green
</label>
<label>
  <input type="radio" name="color" value="blue" bind:group={color} />
  Blue
</label>

<h1>FAVORITE COLOR</h1>
<label>
  <input type="checkbox" name="color" value="red" bind:group={color} />
  Red
</label>
<label>
  <input type="checkbox" name="color" value="green" bind:group={color} />
  Green
</label>
<label>
  <input type="checkbox" name="color" value="blue" bind:group={color} />
  Blue
</label>

<select bind:value={colorOptions}>
  <option value="green">Green</option>
  <option value="red">Red</option>
  <option value="blue">Blue</option>
</select>
