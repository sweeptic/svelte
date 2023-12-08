<script>
  import MeetupItem from './../components/Meetup/MeetupItem.svelte';
  import MeetupFilter from './../components/Meetup/MeetupFilter.svelte';
  import LoadingSpinner from './../components/UI/LoadingSpinner.svelte';
  import EditMeetup from './../components/Meetup/EditMeetup.svelte';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import Button from '../components/UI/Button.svelte';
  import meetups from '../meetups-store';

  let fetchedMeetups = [];

  let editMode;
  let editedId;
  let isLoading;

  let favsOnly = false;
  let unsubscribe;

  const dispatch = createEventDispatcher();

  function setFilter(event) {
    favsOnly = event.detail === 1;
  }

  $: filteredMeetups = favsOnly
    ? fetchedMeetups.filter((m) => m.isFavorite)
    : fetchedMeetups;

  onMount(() => {
    console.log('fetch in client side');
    unsubscribe = meetups.subscribe((items) => {
      fetchedMeetups = items;
    });
    isLoading = true;
    fetch(
      'https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/meetups.json',
      {
        method: 'GET',
      },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('fetching meetups failed !');
        }

        return res.json();
      })
      .then((data) => {
        const loadedMeetups = [];
        for (const key in data) {
          const element = data[key];
          loadedMeetups.push({ ...element, id: key });
        }

        setTimeout(() => {
          meetups.setMeetups(loadedMeetups.reverse());
          isLoading = false;
        }, 1000);
      })
      .catch((err) => {
        console.log('err', err);
        error = err;
        isLoading = false;
      });
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  function savedMeetup() {
    editMode = null;
    editedId = null;
  }

  function cancelEdit() {
    editMode = null;
    editedId = null;
  }

  function startEdit(event) {
    editMode = 'edit';
    editedId = event.detail;
  }
</script>

<svelte:head>
  <title>All Meetups</title>
</svelte:head>

{#if editMode === 'edit'}
  <EditMeetup id={editedId} on:save={savedMeetup} on:cancel={cancelEdit} />
{/if}
{#if isLoading}
  <LoadingSpinner />
{:else}
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
{/if}

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
