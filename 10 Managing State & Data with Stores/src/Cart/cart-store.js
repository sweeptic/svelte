import { writable } from 'svelte/store';





const cart = writable([
    // {
    //     id: 'p3',
    //     title: 'Test',
    //     price: 9.99,
    //     description: 'desc text'
    // },
    // {
    //     id: 'p4',
    //     title: 'Test',
    //     price: 9.99,
    //     description: 'desc text'
    // }
]);

const customCart = {
    subscribe: cart.subscribe,
    addItem: (item) => {
        cart.update((items) => {
            return [...items, item];
        });
    },
    removeItem: (id) => {
        cart.update((items) => {
            return items.filter((i) => i.id !== id);
        });
    }
};


export default customCart;
