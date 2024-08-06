import {View, Text, StyleSheet} from "react-native";
import {useBLE} from "../../utils/useBLE";
import {useEffect, useState} from "react";
import {Button, Input} from "@rneui/themed";

export default function CreateHomeDevice() {

    const [ssid, setSsid] = useState("");
    const [password, setPassword] = useState("");

    const {
        allDevices,
        requestPermissions,
        scanForPeripherals,
        connectToDevice,
        connectedDevice,
        handleSendWifiCredentials
    } = useBLE();

    const scanForDevices = async () => {
        console.log("Scanning for devices...")
        const isPermissionsEnabled = await requestPermissions();
        if (isPermissionsEnabled) {
            scanForPeripherals();
        }
    };

    useEffect(() => {
        scanForDevices();
    }, []);

    useEffect(() => {
        if (allDevices.length === 0) return;
        connectToDevice(allDevices[0]);
    }, [allDevices]);

    const sendCredentialsToDevice = async () => {
        if (!connectedDevice) return;
        try {
            console.log("SENDING CREDENTIALS")
            const req = await handleSendWifiCredentials(ssid, password);
            console.log(req);
        } catch (e) {
            console.log(e)
        }
    }

    if (!connectedDevice) {
        return (
            <View
                style={styles.container}
            >
                <Text>Scanning for devices...</Text>
            </View>
        )
    }


        return (
        <View
            style={styles.container}
        >
            <View>
                <Text>Connected device: {connectedDevice?.name}</Text>
                <View
                    style={styles.containerInput}
                >
                    <Input
                        placeholder="SSID"
                        onChangeText={(text) => setSsid(text)}
                    />
                    <Input
                        secureTextEntry={true}
                        placeholder='Password'
                        onChangeText={(text) => setPassword(text)}

                    />
                    <Button
                        title="Save credentials"
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
                        onPress={sendCredentialsToDevice}
                    />
                </View>
            </View>
        </View>
    )
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
        marginTop: 20,
    },

})