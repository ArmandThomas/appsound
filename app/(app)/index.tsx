import {StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from "react";
import {usePushNotifications} from "../../utils/usePushNotifications";
import { ListItem,Avatar} from '@rneui/themed';
import {useUserStore} from "../../stores/useUserStore";

import PlayIcon from "../../assets/bouton-jouer.png";
import AlarmIcon from "../../assets/sirene.png";
import GlassIcon from "../../assets/window.png";
import PauseIcon from "../../assets/pause.png";

import { Audio } from 'expo-av';

export default function Index() {

    const [homes, setHomes] = useState([]);
    const [idHome, setIdHome] = useState(null);
    const [dataHome, setDataHome] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingId, setPlayingId] = useState(null);

    const { expoPushToken, notification } = usePushNotifications();

    const jwt = useUserStore((state) => state.jwt);

    useEffect(() => {
        try {
            getUserHomes();
        } catch (e) {
            console.log(e)
            alert("Unable to fetch homes. Please try again later.");
        }

    }, []);

    useEffect(() => {
        if (idHome) {
            fetch(process.env.EXPO_PUBLIC_API_URL + `/home/${idHome}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res)
                    setDataHome(res);
                });
        }
    }, [idHome]);

    const getUserHomes = () => {
        fetch(process.env.EXPO_PUBLIC_API_URL + "/home", {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setHomes(res);
                if (res.length > 0) {
                    setIdHome(res[0]._id);
                }
            });
    }

    const callBackStatusAudio = (status) => {
        if (status.didJustFinish) {
            setIsPlaying(false);
            setPlayingId(null);
            setSound(null);
        }
    }

    const playSound = async (idPrediction) => {
        const URL = process.env.EXPO_PUBLIC_API_URL + `/prediction/getaudio/${idPrediction}`;
        const sound = new Audio.Sound();
        setSound(sound);
        setIsPlaying(true);
        setPlayingId(idPrediction);
        await sound.setOnPlaybackStatusUpdate(callBackStatusAudio);
        await sound.loadAsync({ uri: URL });
        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const getHoursAndMinutes = (date) => {
        const dateObj = new Date(date);
        return `${dateObj.getHours()}:${dateObj.getMinutes()}`;
    }


    const predictions = dataHome?.predictions || [];


    return (
        <View style={styles.container}>
            <View style={styles.containerHomes}>
            </View>
            <View style={styles.containerTimeLine}>
                {
                    predictions && predictions.map(prediction => {
                        return (
                            <ListItem
                                key={prediction._id}
                                bottomDivider
                            >
                                <Avatar
                                    rounded
                                    source={prediction.prediction === "glass" ? GlassIcon : AlarmIcon}
                                />
                                <ListItem.Content>
                                    <View style={styles.containerListItem}>
                                        <Text>{getHoursAndMinutes(prediction?.date) || "21:47"}</Text>
                                        <Avatar rounded
                                            source={
                                                isPlaying && playingId === prediction._id
                                                    ? PauseIcon
                                                    : PlayIcon
                                            }
                                            onPress={() => playSound(prediction._id)}
                                        />
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                        )
                    })
                }
            </View>
        </View>
    );
}

const styles =  StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerTimeLine: {
        width: '95%',
        borderRadius: 10,
        flex: 7,
    },
    containerHomes : {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    containerListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "100%",
    }

})