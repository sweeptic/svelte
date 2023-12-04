<script>
  import MeetupGrid from './Meetups/MeetupGrid.svelte';
  import Header from './UI/Header.svelte';
  import meetupsData from './data/data';

  let title = 'new title';
  let subtitle = 'new subtitle';
  let imageUrl =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Caffe_Nero_coffee_bar%2C_High_St%2C_Sutton%2C_Surrey%2C_Greater_London.JPG/800px-Caffe_Nero_coffee_bar%2C_High_St%2C_Sutton%2C_Surrey%2C_Greater_London.JPG';
  let address = 'new address';
  let contactEmail = 'new contact email';
  let description = 'new description';
  let meetups = meetupsData;

  function addMeetup(data) {
    const newMeetup = {
      id: Math.random(),
      title,
      subtitle,
      imageUrl,
      address,
      contactEmail,
      description,
    };

    meetups = [...meetups, newMeetup];
  }
</script>

<Header />
<main>
  <form on:submit|preventDefault={addMeetup}>
    <div class="form-control">
      <label for="title">title</label>
      <input type="text" id="title" bind:value={title} />
    </div>
    <div class="form-control">
      <label for="subtitle">subtitle</label>
      <input type="text" id="subtitle" bind:value={subtitle} />
    </div>
    <div class="form-control">
      <label for="imageUrl">imageUrl</label>
      <input type="text" id="imageUrl" bind:value={imageUrl} />
    </div>
    <div class="form-control">
      <label for="address">address</label>
      <input type="text" id="address" bind:value={address} />
    </div>
    <div class="form-control">
      <label for="contactEmail">contactEmail</label>
      <input type="text" id="contactEmail" bind:value={contactEmail} />
    </div>
    <div class="form-control">
      <label for="description">description</label>
      <textarea rows="3" id="description" bind:value={description} />
    </div>
    <button type="submit">Save</button>
  </form>
  <MeetupGrid {meetups} />
</main>

<style>
  main {
    position: relative;
    margin-top: 120px;
  }
  /* your styles go here */
  input,
  textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: none;
    border-bottom: 2px solid #ccc;
    border-radius: 3px 3px 0 0;
    background: white;
    padding: 0.15rem 0.25rem;
    transition: border-color 0.1s ease-out;
  }

  input:focus,
  textarea:focus {
    border-color: #e40763;
    outline: none;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .form-control {
    padding: 0.5rem 0;
    width: 100%;
    margin: 0.25rem 0;
  }
</style>
