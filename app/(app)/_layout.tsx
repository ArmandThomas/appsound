import { Redirect, Stack } from 'expo-router';
import { useUserStore} from "../../stores/useUserStore";
import {useEffect, useState} from "react";

export default function AppLayout() {

    const jwt = useUserStore((state) => state.jwt);

    if (!jwt) {
        return <Redirect href="/auth" />;
    }


    return <Stack

        screenOptions={{
            headerShown: false,
        }}

    />;
}