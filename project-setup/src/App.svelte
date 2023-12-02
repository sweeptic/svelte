<script>
  import ContactCard from './ContactCard.svelte';

  export let name = 'Max';
  export let age = 12;
  export let title = 'title';
  export let imageUrl =
    'https://unsplash.com/photos/the-sun-is-setting-over-a-desert-landscape-lzXhI_uxnvo';
  export let description = 'description';

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
