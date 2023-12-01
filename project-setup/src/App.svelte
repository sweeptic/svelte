<script>
  export let name = 'Max';
  export let age = 12;

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
<input type="text" value={name} on:input={nameInput} />
<br />
<input type="text" bind:value={name} />

<style>
  h1 {
    color: purple;
  }
</style>
