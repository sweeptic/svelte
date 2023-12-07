<script>
  import { onMount } from 'svelte';

  let hobbies = [];
  let hobbyInput = `dummyData`;
  let isLoading = false;

  //   onMount(() => {
  // async function loadData() {
  let data = fetch(
    'https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/hobbies.json',
    { method: 'GET' },
  );

  //   let respData = await data.json();
  //   hobbies = Object.values(respData);
  // }
  // loadData();
  //   });

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

<!-- {#if isLoading}
  <p>Loading...</p>
{:else}
  <ul>
    {#each hobbies as hobby (Math.random())}
      <li>{hobby}</li>
    {/each}
  </ul>
{/if} -->

{#await data}
  <p>Loading...</p>
  <!-- promise is pending -->
{:then hobbyData}
  {#each hobbyData as hobby (Math.random())}
    <li>{hobby}</li>
  {/each}
{:catch error}
  <!-- promise was rejected -->
{/await}
