<script>
  import MeetupGrid from './Meetups/MeetupGrid.svelte';
  import Header from './UI/Header.svelte';
  import meetups from './data/data';
</script>

<Header />
<main>
  <MeetupGrid {meetups} />
</main>
