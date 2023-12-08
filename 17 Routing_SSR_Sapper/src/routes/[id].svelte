<script context="module">
  export function preload(page) {
    const meetupId = page.params.id;

    return this.fetch(
      `https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/meetups/${meetupId}.json`,
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
      .then((meetupData) => {
        return { loadedMeetup: { ...meetupData, id: meetupId } };
      })
      .catch((err) => {
        this.Error(404, 'error');
      });
  }
</script>

<script>
  import Button from '../components/UI/Button.svelte';

  export let loadedMeetup;
</script>

<section>
  <div class="image">
    <img src={loadedMeetup.imageUrl} alt={loadedMeetup.title} />
  </div>
  <div class="content">
    <h1>{loadedMeetup.title}</h1>
    <h2>{loadedMeetup.subtitle}</h2>
    <p>{loadedMeetup.address}</p>
    <p>{loadedMeetup.description}</p>
    <Button href="mailto:{loadedMeetup.contactEmail}">Contact</Button>
    <Button mode="outline" href="/">Close</Button>
  </div>
</section>

<style>
  section {
    margin-top: 4rem;
  }

  .image {
    width: 50%;
    height: 50%;
    /* height: 25rem; */
  }

  img {
    width: 50%;
    height: 50%;
    object-fit: cover;
  }

  .image {
    background: #e7e7e7;
  }

  .content {
    text-align: center;
    width: 80%;
    margin: auto;
  }

  h1 {
    font-size: 2rem;
    font-family: 'Roboto Slab', sans-serif;
    margin: 0.5rem 0;
  }

  h2 {
    font-size: 1.25rem;
    color: #6b6b6b;
  }

  p {
    font-size: 1.5rem;
  }
</style>
