<script>
  import { timer } from './timer-store.js';
  import Button from './UI/Button.svelte';
  import Cart from './Cart/Cart.svelte';
  import Products from './Products/Products.svelte';

  let showCart = true;

  //   timer.subscribe((count) => {
  //     console.log('App: ', count);
  //   });
</script>

<Button
  on:click={() => {
    showCart = !showCart;
  }}>Toggle Cart</Button
>
<p>Count: {$timer}</p>
{#if showCart}
  <Cart />
{/if}
<Products />
