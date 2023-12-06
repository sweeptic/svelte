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

  function addMeetup() {
    editMode = null;
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
  <MeetupGrid meetups={$meetups} />
</main>

<style>
  main {
    margin-top: 5rem;
  }
  .meetup-controls {
    margin: 1rem;
  }
</style>
