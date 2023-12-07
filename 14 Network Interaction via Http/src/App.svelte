<script>
  let hobbies = [];
  let hobbyInput = `dummyData`;
  let isLoading = false;

  async function addHobby() {
    hobbies = [...hobbies, hobbyInput];
    isLoading = true;
    try {
      let res = await fetch(
        'https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/hobbies.json',

        {
          method: 'POST',
          body: JSON.stringify(hobbyInput + ' - ' + Math.random()),
          headers: {
            'Content-Type': ' application/json',
          },
        },
      );

      if (res.ok) {
        console.log('res', res);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      isLoading = false;
    }
  }
</script>

<!-- https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/ -->

<label for="hobby"></label>
<input type="text" id="hobby" bind:value={hobbyInput} />
<button on:click={addHobby}>Add Hobby</button>

{#if isLoading}
  <p>Loading...</p>
{:else}
  <ul>
    {#each hobbies as hobby (Math.random())}
      <li>{hobby}</li>
    {/each}
  </ul>
{/if}
