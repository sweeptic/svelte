<script>
  import Modal from '../UI/Modal.svelte';
  import TextInput from '../UI/TextInput.svelte';
  import Button from '../UI/Button.svelte';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { isEmpty, isValidEmail } from '../../helpers/validation.js';
  import meetups from '../../meetups-store';

  export let id = null;

  let title = 'a';
  let subtitle = 'b';
  let address = 'c';
  let email = 'd@e.fg';
  let description = 'h';
  let imageUrl = 'i';

  if (id) {
    const unsubscribe = meetups.subscribe((items) => {
      const selectedMeetup = items.find((i) => i.id === id);
      title = selectedMeetup.title;
      subtitle = selectedMeetup.subtitle;
      address = selectedMeetup.address;
      email = selectedMeetup.contactEmail;
      description = selectedMeetup.description;
      imageUrl = selectedMeetup.imageUrl;
    });

    unsubscribe();
  }

  const dispatch = createEventDispatcher();

  $: titleValid = !isEmpty(title);
  $: subtitleValid = !isEmpty(subtitle);
  $: addressValid = !isEmpty(address);
  $: imageUrlValid = !isEmpty(imageUrl);
  $: emailValid = !isEmpty(email) && isValidEmail(email);
  $: descriptionValid = !isEmpty(description);
  $: formIsValid =
    titleValid &&
    subtitleValid &&
    addressValid &&
    imageUrlValid &&
    emailValid &&
    descriptionValid;

  function submitForm() {
    const meetupData = {
      //   id: Math.random().toString(),
      title: title,
      subtitle: subtitle,
      description: description,
      imageUrl: imageUrl,
      contactEmail: email,
      address: address,
    };

    if (id) {
      fetch(
        `https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatxxxxxabase.app/meetups/${id}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify(meetupData),
          headers: { 'Content-Type': 'application/json' },
        },
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed!');
          }
          meetups.updateMeetup(id, meetupData);
        })

        .catch((err) => {
          console.log('err', err);
        });
    } else {
      fetch(
        'https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/meetups.json',
        {
          method: 'POST',
          body: JSON.stringify({ ...meetupData, isFavorite: false }),
          headers: { 'Content-Type': 'application/json' },
        },
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed!');
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          meetups.addMeetup({
            ...meetupData,
            isFavorite: false,
            id: data.name,
          });
        })
        .catch((err) => {
          console.log('err', err);
        });
    }

    dispatch('save');
  }

  function cancel() {
    dispatch('cancel');
  }

  function deleteMeetup() {
    fetch(
      `https://ng-course-recipe-book-d5b48-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`,
      {
        method: 'DELETE',
      },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed!');
        }

        meetups.removeMeetup(id);
      })

      .catch((err) => {
        console.log('err', err);
      });
    dispatch('save');
  }
</script>

<Modal title="Edit Meetup Data" on:cancel>
  <form on:submit|preventDefault={submitForm}>
    <TextInput
      id="title"
      label="Title"
      valid={titleValid}
      validityMessage="Please enter a valid title."
      value={title}
      on:input={(event) => (title = event.target.value)}
    />
    <TextInput
      id="subtitle"
      label="Subtitle"
      valid={subtitleValid}
      validityMessage="Please enter a valid subtitle."
      value={subtitle}
      on:input={(event) => (subtitle = event.target.value)}
    />
    <TextInput
      id="address"
      label="Address"
      valid={addressValid}
      validityMessage="Please enter a valid address."
      value={address}
      on:input={(event) => (address = event.target.value)}
    />
    <TextInput
      id="imageUrl"
      label="Image URL"
      valid={imageUrlValid}
      validityMessage="Please enter a valid image url."
      value={imageUrl}
      on:input={(event) => (imageUrl = event.target.value)}
    />
    <TextInput
      id="email"
      label="E-Mail"
      valid={emailValid}
      validityMessage="Please enter a valid email address."
      type="email"
      value={email}
      on:input={(event) => (email = event.target.value)}
    />
    <TextInput
      id="description"
      label="Description"
      valid={descriptionValid}
      validityMessage="Please enter a valid description."
      controlType="textarea"
      bind:value={description}
    />
  </form>
  <div slot="footer">
    <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
    <Button type="button" on:click={submitForm} disabled={!formIsValid}
      >Save</Button
    >
    {#if id}
      <Button type="button" on:click={deleteMeetup}>Delete</Button>
    {/if}
  </div>
</Modal>

<style>
  form {
    width: 100%;
  }
</style>
