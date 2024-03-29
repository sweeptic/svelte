import { readable } from "svelte/store";


let count = 0;

export const timer = readable(0, (set) => {
    setInterval(() => {
        count++;
        set(count);
    }, 1000);

    return () => { clearInterval(); };
});
