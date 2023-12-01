<script>
  export let name = 'asdfgh';
  export let age = 12;

  function incrementAge() {
    age++;
  }
</script>

<h1>Hello {name}, {age}!</h1>
<button on:click={incrementAge}>Change Age</button>

<style>
  h1 {
    color: purple;
  }
</style>
