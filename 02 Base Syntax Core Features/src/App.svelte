<script>
  import ContactCard from './ContactCard.svelte';

  export let name = '';
  export let age = '';
  export let title = '';
  export let imageUrl = '';

  export let description = 'description <strong>abc</strong>';

  $: uppercaseName = name.toUpperCase(); // label statement

  $: console.log(name);

  $: if (name === 'Maximilian') {
    console.log('runs');
    age = 31;
  }

  function incrementAge() {
    age++;
  }

  function changeName() {
    name = 'Maximilian';
  }

  function nameInput(event) {
    // console.log(event);
    name = event.target.value;
  }
</script>

<h1>Hello {name.toUpperCase()}, {age}!</h1>
<h1>Hello {uppercaseName}, {age}!</h1>

<button on:click={incrementAge}>Change Age</button>
<button on:click={changeName}>Change Age</button>
<br />
<br />
<input type="text" bind:value={name} />
<br />
<input type="text" bind:value={title} />
<br />
<input type="text" bind:value={imageUrl} />
<br />
<input type="text" bind:value={description} />

<ContactCard {name} {title} {description} {imageUrl} />

<style>
  h1 {
    color: purple;
  }
</style>
