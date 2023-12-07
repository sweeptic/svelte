<script>
  import { writable } from 'svelte/store';
  import { tweened } from 'svelte/motion';
  import { cubicIn } from 'svelte/easing';

  const progress = tweened(0, {
    delay: 0,
    duration: 700,
    easing: cubicIn,
    // interpolator: () => {}
  });

  //   const progress = writable(0);

  setTimeout(() => {
    progress.set(0.5);
  }, 1500);
</script>

<progress value={$progress}></progress>
