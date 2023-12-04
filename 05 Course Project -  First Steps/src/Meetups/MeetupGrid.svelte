<script>
  import MeetupItem from './MeetupItem.svelte';
  export let meetups;
</script>

<section>
  {#each meetups as meetup, i (meetup.id)}
    <MeetupItem {meetup} />
  {/each}
</section>

<style>
  section {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  @media (min-width: 768px) {
    section {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
