<script>
  import Error from './UI/Error.svelte';
  import MeetupDetail from './Meetups/MeetupDetail.svelte';
  import EditMeetup from './Meetups/EditMeetup.svelte';
  import Button from './UI/Button.svelte';
  import Header from './UI/Header.svelte';
  import MeetupGrid from './Meetups/MeetupGrid.svelte';
  import meetups from './Meetups/meetups-store';
  import LoadingSpinner from './UI/LoadingSpinner.svelte';

  let editMode;
  let editedId;
  let page = 'overview';
  let pageData = {};
  let isLoading = true;
  let error;

  function fetchData() {
    fetch('https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/meetups.json', {
      method: 'GET',
    })
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
  }

  fetchData();

  function savedMeetup() {
    editMode = null;
    editedId = null;
  }

  function cancelEdit() {
    editMode = null;
    editedId = null;
  }

  function showDetails(event) {
    console.log(event);
    page = 'details';
    pageData.id = event.detail.xxx;
  }

  function closeDetails() {
    page = 'overview';
    pageData = {};
  }

  function startEdit(event) {
    editMode = 'edit';
    editedId = event.detail;
  }

  function clearError() {
    error = undefined;
  }

  //   console.log('meetups', meetups);
  //   console.log('$meetups', $meetups);
</script>

{#if error}
  <Error message={error.message} on:cancel={clearError} />
{/if}

<Header />

<main>
  {#if page === 'overview'}
    <!-- add new or edit existing -->
    {#if editMode === 'edit'}
      <!-- ok -->
      <EditMeetup id={editedId} on:save={savedMeetup} on:cancel={cancelEdit} />
    {/if}

    {#if isLoading}
      <!-- ok -->
      <LoadingSpinner />
    {:else}
      <!-- ok -->
      <MeetupGrid
        meetups={$meetups}
        on:showdetails={showDetails}
        on:edit={startEdit}
        on:add={() => (editMode = 'edit')}
        on:dispatch_action={() => console.log('dispatched')}
      />
    {/if}
  {:else}
    <!-- ok -->
    <MeetupDetail id={pageData.id} on:close={closeDetails} />
  {/if}
</main>

<style>
  main {
    margin-top: 5rem;
  }
</style>
