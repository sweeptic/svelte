<script>
  import TextInput from './UI/TextInput.svelte';
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
    <TextInput
      label="title"
      id="title"
      value={title}
      type="text"
      on:input={(event) => (title = event.target.value)}
    />
    <TextInput
      label="subtitle"
      id="subtitle"
      value={subtitle}
      type="text"
      on:input={(event) => (subtitle = event.target.value)}
    />
    <TextInput
      label="imageUrl"
      id="imageUrl"
      value={imageUrl}
      type="text"
      on:input={(event) => (imageUrl = event.target.value)}
    />
    <TextInput
      label="address"
      id="address"
      value={address}
      type="text"
      on:input={(event) => (address = event.target.value)}
    />
    <TextInput
      label="contactEmail"
      id="contactEmail"
      value={contactEmail}
      type="email"
      on:input={(event) => (contactEmail = event.target.value)}
    />
    <TextInput
      label="description"
      id="description"
      type="textarea"
      value={description}
      on:input={(event) => (description = event.target.value)}
    />

    <button type="submit">Save</button>
  </form>
  <MeetupGrid {meetups} />
</main>

<style>
  main {
    position: relative;
    margin-top: 120px;
    background-color: rgb(255, 219, 219);
  }
  /* your styles go here */
  form {
    width: 50%;
    margin: auto;
  }
</style>
