import {create} from "zustand";

export const useCurrentHome = create((set) => ({
    name: null,
    users : [],
    devices: [],
    setCurrentHome: ({ name, users, devices }) => set({ name, users, devices }),
    setName: ({ name }) => set({ name }),
}));