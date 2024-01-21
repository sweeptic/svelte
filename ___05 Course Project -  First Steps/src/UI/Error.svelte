<script>
  import Modal from './Modal.svelte';

  export let message;

  // your script goes here
</script>

<Modal title="An error occurred!" on:cancel>
  <p>{message}</p>
</Modal>
