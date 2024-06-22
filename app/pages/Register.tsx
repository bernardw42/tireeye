import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import white from "../../assets/white.png";
import blob1 from "../../assets/blob1.png";
import blob2 from "../../assets/blob2.png";
import blob3 from "../../assets/blob3.png";
import { AntDesign } from '@expo/vector-icons';

export default function Register() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];
            const userExists = users.find((user: any) => user.email === email);

            if (userExists) {
                Alert.alert("User Exists", "This email is already registered.");
                return;
            }

            const newUser = { email, password };
            users.push(newUser);
            await AsyncStorage.setItem('users', JSON.stringify(users));
            Alert.alert("Success", "You have registered successfully.");
            navigation.navigate("Login");
        } catch (error) {
            console.error("Failed to register:", error);
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
                    <View className="flex-1 items-center gap-y-[40px] pt-[30px]">
                        <Image source={white} className="w-[260px] h-[260px]" />
                        <View className="form space-y-2 items-center">
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
                        <TouchableOpacity className="py-3 bg-white w-[300px] rounded-2xl" onPress={handleRegister}>
                            <Text className="font-bold text-center text-[#023535]">REGISTER</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
