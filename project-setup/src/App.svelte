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
</script>

<h1>Hello {name.toUpperCase()}, {age}!</h1>
<h1>Hello {uppercaseName}, {age}!</h1>
<button on:click={incrementAge}>Change Age</button>
<button on:click={changeName}>Change Age</button>

<style>
  h1 {
    color: purple;
  }
</style>
