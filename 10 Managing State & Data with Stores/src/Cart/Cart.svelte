<script>
  import { onDestroy } from 'svelte';
  import cartItems from './cart-store.js';
  import CartItem from './CartItem.svelte';
  import { timer } from '../timer-store.js';

  //   const unsubscribe = timer.subscribe((count) => {
  //     console.log('Cart: ', count);
  //   });

  //   onDestroy(() => {
  //     if (unsubscribe) {
  //       unsubscribe();
  //     }
  //   });

  $: console.log('timer', $timer);
  


  //   let items;

  //   const unsubscribe = cartItems.subscribe(its => {
  //     items = its;
  //   });

  //   export let items = [
  //     {
  //       id: "p1",
  //       title: "Test",
  //       price: 9.99
  //     },
  //     {
  //       id: "p2",
  //       title: "Test",
  //       price: 9.99
  //     }
  //   ];
</script>

<section>
  <h1>Cart</h1>
  <p>Count: {$timer}</p>
  <ul>
    {#each $cartItems as item (item.id)}
      <CartItem id={item.id} title={item.title} price={item.price} />
    {:else}
      <p>No items in cart yet!</p>
    {/each}
  </ul>
</section>

<style>
  section {
    width: 30rem;
    max-width: 90%;
    margin: 2rem auto;
    border-bottom: 2px solid #ccc;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
