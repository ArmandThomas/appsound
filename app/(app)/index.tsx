import {StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from "react";
import {usePushNotifications} from "../../utils/usePushNotifications";
import { ListItem,Avatar} from '@rneui/themed';
import {useUserStore} from "../../stores/useUserStore";

export default function Index() {

    const [homes, setHomes] = useState([]);
    const [idHome, setIdHome] = useState(null);
    const [dataHome, setDataHome] = useState(null);

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

    const {predictions} = dataHome || [];

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
                                    source={{
                                        uri: 'https://1000logos.net/wp-content/uploads/2020/08/SoundCloud-Logo.jpg',
                                    }}
                                />
                                <ListItem.Content>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems : "center", width: "100%"}}>
                                        <Avatar rounded    source={{
                                            uri: 'https://1000logos.net/wp-content/uploads/2020/08/SoundCloud-Logo.jpg',
                                        }} />
                                        <Text>21:42</Text>
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
    }

})