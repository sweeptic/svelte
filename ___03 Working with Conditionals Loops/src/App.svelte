<script>
  import ContactCard from './ContactCard.svelte';

  let name = 'Max';
  let title = 'a';
  let image = 'b';
  let description = 'c';
  let formState = 'empty';

  let createdContacts = [];

  function addContact(event, b, c) {
    console.log('event', event);
    console.log('b', b);
    console.log('c', c);

    if (
      name.trim().length === 0 ||
      title.trim().length === 0 ||
      image.trim().length === 0 ||
      description.trim().length === 0
    ) {
      formState = 'invalid';
      return;
    }
    console.log('push');

    createdContacts = [
      // EQUAL SIGN TRIGGER :DDDDDDD
      ...createdContacts,
      {
        id: Math.random(),
        name: name,
        jobTitle: title,
        imageUrl: image,
        desc: description,
      },
    ];
    // ez beupdateli a statet, csak nem fog renderelni ...
    // createdContacts.push({
    //   id: Math.random(),
    //   name: name,
    //   jobTitle: title,
    //   imageUrl: image,
    //   desc: description,
    // });

    formState = 'done';
  }

  function deleteFirst(params) {
    // createdContacts.shift(); // ez beupdateli a statet, csak nem fog renderelni ...
    // uj peldany kell mint a reactban.
    createdContacts = createdContacts.slice(1);
  }

  function deleteLast(params) {
    createdContacts = createdContacts.slice(0, -1);
  }

  function removePassword(param) {
    console.log('param', param);

    const newArr = [...createdContacts];
    newArr.splice(param, 1);
    createdContacts = newArr;
  }
</script>

<div id="form">
  <div class="form-control">
    <label for="name">User Name</label>
    <input type="text" bind:value={name} id="name" />
  </div>
  <div class="form-control">
    <label for="jobTitle">Job Title</label>
    <input type="text" bind:value={title} id="jobTitle" />
  </div>
  <div class="form-control">
    <label for="image">Image URL</label>
    <input type="text" bind:value={image} id="image" />
  </div>
  <div class="form-control">
    <label for="desc">Description</label>
    <textarea rows="3" bind:value={description} id="desc" />
  </div>
</div>
<!-- event modifiers -->
<!-- once -->
<!-- passive -->
<!-- capture -->
<!-- stopPropagation -->
<!-- preventDefault -->

<!-- <button on:click|stopPropagation={addContact.bind(this, 'param')}
  >Add Contact Card</button
> -->

<button on:click|stopPropagation={(ev) => addContact(ev, 'param')}>Add Contact Card arrow</button>
<button on:click={deleteFirst}>Delete First</button>
<button on:click={deleteLast}>Delete Last</button>

{#if formState === 'invalid'}
  <p>Invalid input</p>
{:else}
  <p>Please enter some data and hit the button</p>
{/if}

{#each createdContacts as contact, i (contact.id)}
  <h2># {i}</h2>
  <ContactCard
    {i}
    {removePassword}
    {contact}
    name={contact.name + Math.round(contact.id * 100)}
    jobTitle={contact.jobTitle}
    description={contact.description}
    userImage={contact.image}
  />
{:else}
  <p>Please start adding some contacts</p>
{/each}

<style>
  #form {
    width: 30rem;
    max-width: 100%;
  }
</style>
