import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

import white from "../../assets/white.png";
import blob1 from "../../assets/blob1.png";
import blob2 from "../../assets/blob2.png";
import blob3 from "../../assets/blob3.png";
import { AntDesign } from '@expo/vector-icons';

export default function Login(){
    const navigation = useNavigation();
    return(
        <SafeAreaView className="flex-1 bg-[#023535]">
            <Image source={blob1} className="absolute top-[-50px] right-[-110px] transform -translate-y-1/2 w-[300px] h-[400px]" resizeMode="contain"/>
            <Image source={blob2} className="absolute top-[25%] left-[-130px] w-[300px] h-[400px]"  resizeMode="contain"/>
            <Image source={blob3} className="absolute bottom-[-80px] right-[-100px] transform -translate-y-1/2 w-[500px] h-[400px]" resizeMode="contain"/>

            <View className="flex justify-start">
                <TouchableOpacity className="pt-[40px] ml-[16px]" onPress={()=> navigation.goBack()}>
                    <AntDesign name="arrowleft" size={35} color="white" />
                </TouchableOpacity>
            </View>

            <View className="flex-1 items-center gap-y-[40px] mt-[5px]"> 
                <Image source={white} className="w-[260px] h-[260px]"></Image>
                <View className="form space-y-2 items-center">
                    <Text className="ml-1 text-white">USERNAME</Text>
                    <TextInput className="py-2 px-4 bg-gray-100 text-gray-700 rounded-2xl w-[300px] mb-[2px]" placeholder="Enter Email"/>
                    <Text className="ml-1 text-white">PASSWORD</Text>
                    <TextInput className="py-2 px-4 bg-gray-100 text-gray-700 rounded-2xl w-[300px]" placeholder="Enter Password"/>
                </View>
                <TouchableOpacity className="py-3 bg-white w-[300px] rounded-2xl" onPress={()=> navigation.navigate("Login")}>
                    <Text className="font-bold text-center text-[#023535]">REGISTER</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}