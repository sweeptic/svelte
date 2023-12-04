<script>
  import MeetupItem from './Meetups/MeetupItem.svelte';
  import Header from './UI/Header.svelte';
  import meetups from './data/data';
</script>

<Header />

{#each meetups as meetup, i (meetup.id)}
  <MeetupItem {meetup} />
{/each}
