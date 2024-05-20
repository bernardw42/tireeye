import { View, Text, SafeAreaView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

import tiree from "../../assets/tireee.png";
import blob1 from "../../assets/blob1.png";
import blob2 from "../../assets/blob2.png";
import blob3 from "../../assets/blob3.png";

export default function Welkam() {
    const navigation = useNavigation();
    return (
        <SafeAreaView className="flex-1 bg-[#023535]">
            <Image source={blob1} className="absolute top-[-50px] right-[-110px] transform -translate-y-1/2 w-[300px] h-[400px]" resizeMode="contain"/>
            <Image source={blob2} className="absolute top-[25%] left-[-130px] w-[300px] h-[400px]"  resizeMode="contain"/>
            <Image source={blob3} className="absolute bottom-[-80px] right-[-100px] transform -translate-y-1/2 w-[500px] h-[400px]" resizeMode="contain"/>

            <View className="flex-1 flex justify-center items-center gap-y-[40px]">
                <Text className="text-white font-bold text-4xl text-center">Let's Get Started!</Text>
                <Image source={tiree} className="w-[300px] h-[300px]" />

                <View className="space-y-4">
                    <TouchableOpacity className="py-3 bg-white w-[300px] rounded-2xl" onPress={() => navigation.navigate("Register")}>
                        <Text className="text-xl font-bold text-center text-[#023535]">Sign Up</Text>
                    </TouchableOpacity>
                    <View className="flex-row justify-center">
                        <Text className="text-white">Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text className="text-white font-semibold"> Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
