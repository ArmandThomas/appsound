import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from "react";
import {usePushNotifications} from "../../utils/usePushNotifications";
import {Button} from '@rneui/themed';
import {useUserStore} from "../../stores/useUserStore";

import {useNavigation} from "expo-router";
import { Image } from '@rneui/themed';

import AlarmIcon from "../../assets/sirene.png";
import GlassIcon from "../../assets/window.png";

import {useCurrentHome} from "../../stores/UseCurrentHome";
import {fetchApi} from "../../utils/fetchApi";

interface Prediction {
    _id: string;
    date: string;
    prediction: "background" | "alarm" | "glass";
    device: string;
}

const TimelineItem = ({ item }) => {


    const getDate = (date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString();
    }

    const getDateAndHoursAndMinutes = (date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleString();
    }
    console.log(item)
    return (
        <View
            style={styles.containerTimelineItem}
        >
            <Image
                source={item.prediction === "alarm" ? AlarmIcon : GlassIcon}
                style={{width: 50, height: 50}}
            />

            <Text>{getDateAndHoursAndMinutes(item.date)}</Text>

        </View>
    );

}

export default function Index() {

    const navigation = useNavigation();
    const { expoPushToken } = usePushNotifications();

    const [predictions, setPredictions] = useState([]);

    const {
        setCurrentHome,
        getDataCurrentHome,
        setName,
        name,
        devices
    } = useCurrentHome();

    const {
        jwt,
        pushToken
    } = useUserStore((state) => state);

    useEffect(() => {
        if (!expoPushToken) return;
        if (pushToken === expoPushToken) return;
        storeExpoToken(expoPushToken).catch((e) => {
            alert(e);
        })
    }, [expoPushToken]);

    const storeExpoToken = async (token) => {
        await fetchApi("/user/save_notification_token", "post", {
            token : token.data
        }, jwt, navigation);
    }

    useEffect(() => {
        try {
            getUserHomes();
        } catch (e) {
            console.log(e)
            alert("Unable to fetch homes. Please try again later.");
        }

    }, []);

    const getHomeData = async (home) => {
        const id = home._id;
        const data = await fetchApi(`/home/${id}`, "get", {}, jwt, navigation);
        setCurrentHome(data.home);
        setPredictions(data.predictions);
    }

    const getUserHomes = async () => {
        const data = await fetchApi("/home", "get", {}, jwt, navigation);
        if (data.length > 0) {
            getHomeData(data[0])
        }
    }

    const goToCreateHome = () => {
        navigation.navigate("createhomename");
    }


    if (!name) {
        return (
            <View style={styles.container}>
                <Text>No homes available</Text>
                <View
                    style={styles.containerButton}
                >
                    <Button
                        onPress={goToCreateHome}
                    >Créer une maison</Button>
                </View>
            </View>
        );
    }

    if (devices.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No devices available</Text>
                <View
                    style={styles.containerButton}
                >
                    <Button
                        onPress={() => navigation.navigate("createhomedevice")}
                    >Ajouter un device</Button>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View
            >
                <Text>Home: {name}</Text>
            </View>
            <View
                style={styles.containerTimeline}
            >

                <FlatList data={predictions} renderItem={TimelineItem}/>

            </View>
            <View
                style={styles.containerAction}
            >
                <Button
                    title="Add a user"
                    buttonStyle={{
                        backgroundColor: "#ff551a",
                        borderRadius: 5,
                    }}
                    containerStyle={{
                        width: 200
                    }}
                    titleStyle={{ color: 'white' }}
                />
                <Button
                    title="Add a device"
                    buttonStyle={{
                        backgroundColor: "#0069d2",
                        borderRadius: 5,
                    }}
                    containerStyle={{
                        width: 320
                    }}
                    titleStyle={{ color: 'white' }}
                />
            </View>
        </View>
    );
}

const styles =  StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 20,
        marginVertical: 80,
    },
    containerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    containerTimeline: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        borderRadius: 5,
    },
    containerTimelineItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        height: 60,
        padding: 10,
        marginTop: 10
    },
    containerAction: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
    }
})