import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import white from "../../assets/white.png";
import blob1 from "../../assets/blob1.png";
import blob2 from "../../assets/blob2.png";
import blob3 from "../../assets/blob3.png";
import { AntDesign } from '@expo/vector-icons';

export default function Forgot() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const sendOtp = async () => {
        if (!validateEmail(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];
            const userExists = users.find((user: any) => user.email === email);

            if (!userExists) {
                Alert.alert("User Not Found", "This email is not registered.");
                return;
            }

            // Generate OTP and save it in the state (In a real app, you would send this via email)
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(newOtp);
            Alert.alert("OTP Sent", `Your OTP code is ${newOtp}`);
        } catch (error) {
            console.error("Failed to send OTP:", error);
        }
    };

    const handleChangePassword = async () => {
        if (otp !== generatedOtp) {
            Alert.alert("Invalid OTP", "The OTP code entered is incorrect.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Password Error", "Passwords do not match.");
            return;
        }

        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];
            const userIndex = users.findIndex((user: any) => user.email === email);

            if (userIndex === -1) {
                Alert.alert("User Not Found", "This email is not registered.");
                return;
            }

            users[userIndex].password = password;
            await AsyncStorage.setItem('users', JSON.stringify(users));
            Alert.alert("Success", "Your password has been changed successfully.");
            navigation.navigate("Login");
        } catch (error) {
            console.error("Failed to change password:", error);
        }
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
                        <Text className="text-3xl font-bold text-white pt-[30px]">FORGOT</Text>
                        <Text className="text-3xl font-bold text-white">PASSWORD</Text>
                        <View className="form space-y-2 items-center pt-[40px] pb-[60px]">
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
                            <Text className="ml-1 text-white">CONFIRM PASSWORD</Text>
                            <TextInput
                                className="py-2 px-4 bg-gray-100 text-gray-700 rounded-2xl w-[300px]"
                                placeholder="Re-Enter Password"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <Text className="ml-1 text-white">OTP CODE</Text>
                            <View className="flex-row items-center w-[300px]">
                                <TextInput
                                    className="py-2 px-4 bg-gray-100 text-gray-700 rounded-l-2xl w-[65%]"
                                    placeholder="Enter OTP Code"
                                    value={otp}
                                    onChangeText={setOtp}
                                    secureTextEntry
                                />
                                <TouchableOpacity className="py-3 bg-white w-[35%] rounded-r-2xl items-center" onPress={sendOtp}>
                                    <Text className="font-bold text-[#023535]">Send OTP</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity className="py-3 bg-white w-[300px] rounded-2xl" onPress={handleChangePassword}>
                            <Text className="font-bold text-center text-[#023535]">CHANGE PASSWORD</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
