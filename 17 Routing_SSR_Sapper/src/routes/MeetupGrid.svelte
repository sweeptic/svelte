<script>
  import { createEventDispatcher } from 'svelte';
  import Button from '../UI/Button.svelte';
  import MeetupFilter from './MeetupFilter.svelte';
  import MeetupItem from './MeetupItem.svelte';
  import { scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  export let meetups;
  let favsOnly = false;

  const dispatch = createEventDispatcher();

  function setFilter(event) {
    favsOnly = event.detail === 1;
  }

  $: filteredMeetups = favsOnly ? meetups.filter((m) => m.isFavorite) : meetups;
</script>

{#if editMode === 'edit'}
  <EditMeetup id={editedId} on:save={savedMeetup} on:cancel={cancelEdit} />
{/if}
{#if isLoading}
  <LoadingSpinner />
{:else}
  <MeetupGrid
    meetups={$meetups}
    on:showdetails={showDetails}
    on:edit={startEdit}
    on:add={() => (editMode = 'edit')}
  />
{/if}

<section id="meetup-controls">
  <MeetupFilter on:select={setFilter} />
  <Button on:click={() => dispatch('add')}>New Meetup</Button>
</section>
{#if filteredMeetups.length === 0}
  <!-- content here -->
  <p>No meetups!</p>
{/if}
<section id="meetups">
  {#each filteredMeetups as meetup (meetup.id)}
    <div transition:scale animate:flip={{ duration: 300 }}>
      <MeetupItem
        id={meetup.id}
        title={meetup.title}
        subtitle={meetup.subtitle}
        description={meetup.description}
        imageUrl={meetup.imageUrl}
        email={meetup.contactEmail}
        address={meetup.address}
        isFav={meetup.isFavorite}
        on:showdetails
        on:edit
      />
    </div>
  {/each}
</section>

<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  #meetup-controls {
    margin: 1rem;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
