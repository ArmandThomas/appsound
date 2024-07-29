import {ActivityIndicator, View} from 'react-native';
import { StyleSheet } from 'react-native';
import {useState} from "react";
import { Text,  Input, Button, Image} from '@rneui/themed';
import {useUserStore} from "../stores/useUserStore";
import { router } from 'expo-router';

export default function Auth() {

    const [isSignIn, setIsSignIn] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async () => {
        const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        const res = await req.json();
        if (res.jwt){
            useUserStore.setState({jwt: res.jwt});
            router.replace("/");
        } else {
            alert("Invalid credentials");
        }
    }

    const handleSignUp = () => {
        alert("method not implemented yet");
    }


    return (
        <View style={styles.container}>

            <Image
                source={{ uri: "https://1000logos.net/wp-content/uploads/2020/08/SoundCloud-Logo.jpg" }}
                containerStyle={styles.item}
                PlaceholderContent={<ActivityIndicator />}
            />
            <View style={styles.containerInput}>
                <Input
                    placeholder="Email"
                    onChangeText={(text) => setEmail(text)}
                />
                <Input
                    secureTextEntry={true}
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}

                />

                <Button
                    title={
                        isSignIn ? "Sign In" : "Sign Up"
                    }
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
                    onPress={() => {
                        isSignIn ? handleSignIn() : handleSignUp()
                    }}
                />
                {
                    isSignIn ? (
                        <Text onPress={() => setIsSignIn(false)}>
                            Don't have an account? Sign Up
                        </Text>
                    ) : (
                        <Text onPress={() => setIsSignIn(true)}>
                            Already have an account? Sign In
                        </Text>
                    )
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
    input: {
        width: '80%',
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    },
    containerInput: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    item: {
        width: 150,
        height: 100,
        margin: 10,
        position: 'relative',
        top: -50,
    }


})