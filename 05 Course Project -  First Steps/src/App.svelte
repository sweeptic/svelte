<script>
  import EditMeetup from './Meetups/EditMeetup.svelte';
  import Button from './UI/Button.svelte';
  import Header from './UI/Header.svelte';
  import MeetupGrid from './Meetups/MeetupGrid.svelte';
  import meetups from './Meetups/meetups-store';

  let title = '';
  let subtitle = '';
  let address = '';
  let email = '';
  let description = '';
  let imageUrl = '';

  //   let meetups

  let editMode;

  function addMeetup(event) {
    const { detail } = event;

    const newMeetup = {
      id: Math.random().toString(),
      title: detail.title,
      subtitle: detail.subtitle,
      description: detail.description,
      imageUrl: detail.imageUrl,
      contactEmail: detail.email,
      address: detail.address,
    };
    // console.log('newMeetup', newMeetup);

    // meetups.push(newMeetup); // DOES NOT WORK!
    meetups = [newMeetup, ...meetups];
    editMode = null;
  }

  function toggleFavorite(event) {
    console.log('event', event);
    const id = event.detail;
    const updatedMeetup = { ...meetups.find((m) => m.id === id) };
    updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
    const index = meetups.findIndex((m) => m.id === id);
    const updatedMeetups = [...meetups];
    updatedMeetups[index] = updatedMeetup;

    meetups = updatedMeetups;
  }

  function cancelEdit() {
    editMode = null;
  }
</script>

<Header />

<main>
  <div class="meetup-controls">
    <Button on:click={() => (editMode = 'add')}>New Meetup</Button>
  </div>

  {#if editMode === 'add'}
    <!-- content here -->
    <EditMeetup on:save={addMeetup} on:cancel={cancelEdit} />
  {/if}
  <MeetupGrid meetups={$meetups} on:toggle-favorite={toggleFavorite} />
</main>

<style>
  main {
    margin-top: 5rem;
  }
  .meetup-controls {
    margin: 1rem;
  }
</style>
