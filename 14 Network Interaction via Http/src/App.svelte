<script>
  let hobbies = [];
  let hobbyInput = `dummyData - ${Math.random()}`;

  async function addHobby() {
    hobbies = [...hobbies, hobbyInput];

    try {
      let res = await fetch(
        'https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/hobbies.json',

        {
          method: 'POST',
          body: JSON.stringify(hobbies),
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
    }
  }
</script>

<!-- https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/ -->

<label for="hobby"></label>
<input type="text" id="hobby" bind:value={hobbyInput} />
<button on:click={addHobby}>Add Hobby</button>

<ul>
  {#each hobbies as hobby (Math.random())}
    <li>{hobby}</li>
  {/each}
</ul>
