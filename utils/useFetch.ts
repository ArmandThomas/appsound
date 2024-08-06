// create me a hook that fetches data from the server

import {useEffect, useState} from "react";
import {useUserStore} from "../stores/useUserStore";

export const useFetch = (url: string, method: string, body: any) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const jwt = useUserStore((state) => state.jwt);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(process.env.EXPO_PUBLIC_API_URL + url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${jwt}`,
                    },
                    body: method === "post" && JSON.stringify(body),
                });
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.log(error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url, method, body]);

    return { data, loading, error };
};