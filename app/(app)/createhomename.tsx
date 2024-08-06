import {StyleSheet, View} from "react-native";
import {Button, Input} from "@rneui/themed";
import {useState} from "react";
import {useNavigation} from "expo-router";
import {useUserStore} from "../../stores/useUserStore";
import {fetchApi} from "../../utils/fetchApi";

export default function Createhomename() {


    const navigation = useNavigation();

    const jwt = useUserStore((state) => state.jwt);

    const [homeName, setHomeName] = useState("");

    const handleGoToNextStep = async () => {

        console.log("handleGoToNextStep");
        await fetchApi("/home", "post", {
            name: homeName,
        }, jwt, navigation);

        navigation.navigate("createhomedevice");

    }

    return (
        <View style={styles.container}>
            <View style={styles.containerInput}>
                <Input
                    placeholder="Home name"
                    onChangeText={(text) => setHomeName(text)}
                />
            </View>
            <Button
                title="Next step"
                buttonStyle={{
                    backgroundColor: "#ff551a",
                    borderRadius: 5,
                }}
                containerStyle={{
                    width: 200,
                    marginHorizontal: 50,
                    marginVertical: 10,
                }}
                titleStyle={{ color: 'white', marginHorizontal: 20 }}
                onPress={handleGoToNextStep}
            />
        </View>
    );
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerInput: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
});