<script>
  import { onMount } from 'svelte';
  import hobbyStore from './hobby-store';

  let hobbies = [];
  let hobbyInput;
  let isLoading = false;

  isLoading = true;
  fetch(
    'https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/hobbies.json',
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then((data) => {
      isLoading = false;
      hobbyStore.setHobbies(Object.values(data));
    })
    .catch((err) => {
      isLoading = false;
      console.log(err);
    });

  function addHobby() {
    hobbies = [...hobbies, hobbyInput.value];

    isLoading = true;
    fetch(
      'https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/hobbies.json',
      {
        method: 'POST',
        body: JSON.stringify(hobbyInput.value),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => {
        isLoading = false;
        if (!res.ok) {
          throw new Error('Failed!');
        }
        // ...
        alert('Saved Data!');
      })
      .catch((err) => {
        isLoading = false;
        console.log(err);
      });
  }
</script>

<label for="hobby">Hobby</label>
<input type="text" id="hobby" bind:this={hobbyInput} />
<button on:click={addHobby}>Add Hobby</button>

{#if isLoading}
  <p>Loading...</p>
{:else}
  <ul>
    {#each $hobbyStore as hobby}
      <li>{hobby}</li>
    {/each}
  </ul>
{/if}

<!-- {#await getHobbies}
  <p>Loading...</p>
{:then hobbyData}
  <ul>
    {#each hobbyData as hobby}
      <li>{hobby}</li>
    {/each}
  </ul>
{:catch error}
  <p>{error.message}</p>
{/await} -->
