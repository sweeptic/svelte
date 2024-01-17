<script>
  export let name;
  export let title;
  export let description;
  export let imageUrl;
</script>

<div class="contact-card">
  <header class:thumb-placeholder={!imageUrl}>
    <p class={"headerStyle"} class:paddingStyle={true}>abcdfdfdd</p>
    <div class="thumb">
      <img src={imageUrl} alt={'link'} />
    </div>

    <div class="user-data">
      <h1>{name}</h1>
      <h2>Job {title}</h2>
    </div>
  </header>

  <div class="description">
    <p>A short {@html description}</p>
  </div>
</div>

<style>
  .contact-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    max-width: 30rem;
    border-radius: 5px;
    margin: 1rem 0;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 7rem;
  }

  .thumb {
    width: 33%;
    height: 100%;
  }

  .headerStyle {
    background-color: red;

  }

    .paddingStyle {

    padding: 1rem;
  }

  .thumb-placeholder {
    background-color: lightgreen;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .user-data {
    width: 67%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    font-size: 1.25rem;
    font-family: 'Roboto Slab', sans-serif;
    margin: 0.5rem 0;
  }

  h2 {
    font-size: 1rem;
    font-weight: normal;
    color: #5a5a5a;
    margin: 0;
    margin-bottom: 0.5rem;
  }

  .description {
    border-top: 1px solid #ccc;
    padding: 1rem;
  }
</style>
