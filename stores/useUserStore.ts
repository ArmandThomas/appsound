import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserStore = create(persist(
    (set) => ({
        jwt: null,
        pushToken: null,
    }),
    {
        name: "user-store2", // Nom unique pour le magasin
        storage: createJSONStorage(() => AsyncStorage), // Stockage pour la persistance
    }
));
