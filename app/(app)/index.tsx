import {StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from "react";
import {usePushNotifications} from "../../utils/usePushNotifications";

import {useUserStore} from "../../stores/useUserStore";

export default function Index() {

    const [homes, setHomes] = useState([]);

    const { expoPushToken, notification } = usePushNotifications();

    const jwt = useUserStore((state) => state.jwt);

    useEffect(() => {
        try {
            getUserHomes();
        } catch (e) {
            alert("Unable to fetch homes. Please try again later.");
        }

    }, [jwt]);

    const getUserHomes = () => {
        fetch(process.env.EXPO_PUBLIC_API_URL + "/home", {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setHomes(res);
            });
    }

    return (
        <View style={styles.container}>
            <Text>Token: {expoPushToken?.data ?? ""}</Text>
            <Text
                onPress={() => {
                }}>
                Sign Out
            </Text>
        </View>
    );
}

const styles =  StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }

})