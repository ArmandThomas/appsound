import {useMemo, useState} from 'react';
import {BleManager, Device} from 'react-native-ble-plx';
import {PermissionsAndroid, Platform} from "react-native";
import * as ExpoDevice from "expo-device";

export const useBLE = () => {

    const bleManager = useMemo(() => new BleManager(), []);
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );

        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"
        );
    };

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "Bluetooth Low Energy requires Location",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                return await requestAndroid31Permissions();
            }
        } else {
            return true;
        }
    };
    const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;
    const scanForPeripherals = () =>
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }
            if (device && device.name === "98:aa:ca:f1:3d:75") {
                setAllDevices((prevState: Device[]) => {
                    // @ts-ignore
                    if (!isDuplicteDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });

    const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
        const binaryString = Array.from(uint8Array)
            .map(byte => String.fromCharCode(byte))
            .join('');
        return btoa(binaryString);
    };
    const handleSendWifiCredentials = async (
        ssid: string,
        password: string
    ) => {
        try {
            await connectedDevice.discoverAllServicesAndCharacteristics();
            // Define the service and characteristic UUIDs
            const service = '5ac1d00e-1ce6-4e53-b904-0822cd136d05';
            const characteristic = '43ada7f1-7ec0-4e14-a4af-920859b5a9e5';

            const credentials = `${ssid}:${password}`;

            const base64Credentials = btoa(credentials);

            console.log(base64Credentials);

            await connectedDevice.writeCharacteristicWithResponseForService(
                service,
                characteristic,
                base64Credentials// Pass the base64 encoded string
            );

            console.log('WiFi credentials sent successfully');
        } catch (error) {
            console.error('Error sending WiFi credentials:', error);
        }
    };


    const connectToDevice = async (device: Device) => {
        try {
            console.log("CONNECTING TO DEVICE", device.id)
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            bleManager.stopDeviceScan();
        } catch (e) {
            console.log("FAILED TO CONNECT", e);
        }
    };
    return {
        allDevices,
        requestPermissions,
        scanForPeripherals,
        connectToDevice,
        connectedDevice,
        handleSendWifiCredentials
    }
}