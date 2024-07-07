import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import white from "../../assets/white.png";
import blob1 from "../../assets/blob1.png";
import blob2 from "../../assets/blob2.png";
import blob3 from "../../assets/blob3.png";
import { AntDesign } from '@expo/vector-icons';

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Preload admin account
        const preloadAdminAccount = async () => {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];
            const adminAccount = { email: "admin@gmail.com", password: "12345" };
            const userExists = users.find((user: any) => user.email === adminAccount.email);
            if (!userExists) {
                users.push(adminAccount);
                await AsyncStorage.setItem('users', JSON.stringify(users));
            }
        };
        preloadAdminAccount();
    }, []);

    const handleLogin = async () => {
        const existingUsers = await AsyncStorage.getItem('users');
        const users = existingUsers ? JSON.parse(existingUsers) : [];
        const user = users.find((user: any) => user.email === email);

        if (!user) {
            Alert.alert("Error", "This email is not registered.");
            return;
        }

        if (user.password !== password) {
            Alert.alert("Error", "The password you entered is incorrect.");
            return;
        }

        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
        navigation.navigate("HomeTabs");
    };

    return (
        <SafeAreaView className="flex-1 bg-[#023535]">
            <Image source={blob1} className="absolute top-[-50px] right-[-110px] transform -translate-y-1/2 w-[300px] h-[400px]" resizeMode="contain" />
            <Image source={blob2} className="absolute top-[25%] left-[-130px] w-[300px] h-[400px]" resizeMode="contain" />
            <Image source={blob3} className="absolute bottom-[-80px] right-[-100px] transform -translate-y-1/2 w-[500px] h-[400px]" resizeMode="contain" />

            <View className="flex justify-start">
                <TouchableOpacity className="pt-[50px] ml-[16px]" onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={35} color="white" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={90}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View className="flex-1 items-center">
                        <Image source={white} className="w-[220px] h-[220px]" />
                        <View className="form space-y-2 items-center pt-[25px] pb-[50px]">
                            <Text className="ml-1 text-white">USERNAME</Text>
                            <TextInput
                                className="py-2 px-4 bg-gray-100 text-gray-700 rounded-2xl w-[300px] mb-[2px]"
                                placeholder="Enter Email"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Text className="ml-1 text-white">PASSWORD</Text>
                            <TextInput
                                className="py-2 px-4 bg-gray-100 text-gray-700 rounded-2xl w-[300px]"
                                placeholder="Enter Password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        <TouchableOpacity className="py-3 bg-white w-[300px] rounded-2xl" onPress={handleLogin}>
                            <Text className="font-bold text-center text-[#023535]">LOG IN</Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center pt-3">
                            <Text className="text-white">Don't have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                                <Text className="text-white font-semibold"> Register</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row justify-center pt-2">
                            <TouchableOpacity onPress={() => navigation.navigate("Forgot")}>
                                <Text className="text-white font-extralight">Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
