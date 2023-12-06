<script>
  import Modal from './../UI/Modal.svelte';
  // your script goes here
  import TextInput from '../UI/TextInput.svelte';
  import Button from '../UI/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import { isEmpty, isValidEmail } from '../helpers/validation';

  let title = '';
  let subtitle = '';
  let address = '';
  let email = '';
  let description = '';
  let imageUrl = '';

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
    dispatch('save', {
      title,
      subtitle,
      address,
      email,
      description,
      imageUrl,
    });
  }

  function onCancel() {
    dispatch('cancel');
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
      validityMessage="Please enter a valid imageUrl."
      value={imageUrl}
      on:input={(event) => (imageUrl = event.target.value)}
    />
    <TextInput
      id="email"
      label="E-Mail"
      valid={emailValid}
      validityMessage="Please enter a valid email."
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
      value={description}
      on:input={(event) => (description = event.target.value)}
    />
    <Button type="submit" mode="outline" on:click={onCancel} slot="footer"
      >Cancel</Button
    >
    <Button disabled={!formIsValid} type="submit" slot="footer">Save</Button>
  </form>
</Modal>

<style>
  form {
    /* width: 30rem; */
    width: 100%;
    /* margin: auto; */
  }
</style>
