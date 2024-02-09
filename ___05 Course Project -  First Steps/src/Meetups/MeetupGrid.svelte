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
  //   ok
  $: filteredMeetups = favsOnly ? meetups.filter((m) => m.isFavorite) : meetups;
  //
</script>

<section id="meetup-controls">
  <!-- ok -->
  <MeetupFilter on:select={setFilter} on:dispatch_action />
  <!-- ok -->
  <Button on:click={() => dispatch('add')}>New Meetup</Button>
</section>
{#if filteredMeetups.length === 0}
  <!-- content here -->
  <p>No meetups!</p>
{/if}
<section id="meetups">
  {#each filteredMeetups as meetup (meetup.id)}
    <!-- {#each meetups as meetup (meetup.id)} -->
    <div transition:scale animate:flip={{ duration: 300 }}>
      <!-- ok -->
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
