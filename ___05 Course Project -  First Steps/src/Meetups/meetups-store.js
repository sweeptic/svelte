import { writable } from 'svelte/store';


const meetups = writable([]);


const customMeetupStore = {
    subscribe: meetups.subscribe,
    // ok
    setMeetups: meetupArray => meetups.set(meetupArray),

    addMeetup: (meetupData) => {
        const newMeetup = {
            ...meetupData,
            // id: Math.random().toString(),
            // isFavorite: false
        };
        meetups.update((items) => {
            return [newMeetup, ...items];
        });
    },

    updateMeetup: (id, meetupData) => {
        meetups.update((items) => {
            const meetupIndex = items.findIndex((i) => i.id === id);
            const updatedMeetup = { ...items[meetupIndex], ...meetupData };
            const updatedMeetups = [...items];
            updatedMeetups[meetupIndex] = updatedMeetup;
            console.log('updatedMeetups', updatedMeetups);

            return updatedMeetups;
        });
    },

    toggleFavorite: (id) => {
        meetups.update((items) => {
            const updatedMeetup = { ...items.find((m) => m.id === id) };
            updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
            const index = items.findIndex((m) => m.id === id);
            const updatedMeetups = [...items];
            updatedMeetups[index] = updatedMeetup;
            return updatedMeetups;
        });
    },

    removeMeetup: (id) => {
        meetups.update((items) => {
            return items.filter((i) => i.id !== id);
        });
    }
};


export default customMeetupStore;