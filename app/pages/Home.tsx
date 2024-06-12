import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import white from "../../assets/white.png";
import blob1 from "../../assets/blob1.png";
import blob2 from "../../assets/blob2.png";
import blob3 from "../../assets/blob3.png";

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export default function Home({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-[#023535]">
      <Image source={blob1} className="absolute top-[-50px] right-[-110px] transform -translate-y-1/2 w-[300px] h-[400px]" resizeMode="contain"/>
      <Image source={blob2} className="absolute top-[25%] left-[-130px] w-[300px] h-[400px]"  resizeMode="contain"/>
      <Image source={blob3} className="absolute bottom-[-80px] right-[-100px] transform -translate-y-1/2 w-[500px] h-[400px]" resizeMode="contain"/>

    <View className="flex-1 flex justify-center items-center gap-y-[20px]">
      <View className="">
        <Image source={white} className="w-[260px] h-[260px]"></Image>
      </View>
      
      {/* Buttons */}
      <View className="flex flex-row justify-around items-center gap-x-[20px]">
        <TouchableOpacity
          className="bg-white w-[100px] h-[100px] rounded-2xl justify-center items-center"
          onPress={() => navigation.navigate("Scan")}
        >
          <MaterialCommunityIcons name="tire" size={60} color="#023535" />
          <Text className="text-[#023535] font-semibold mt-[5px] text-[12px]">SCAN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white w-[100px] h-[100px] rounded-2xl justify-center items-center"
          onPress={() => navigation.navigate("Notes")}
        >
          <MaterialCommunityIcons name="note-edit" size={60} color="#023535" />
          <Text className="text-[#023535] font-semibold mt-[5px] text-[12px]">ARCHIVE</Text>
        </TouchableOpacity>
      </View>

      <View className="flex flex-row justify-around items-center gap-x-[20px]">
        <TouchableOpacity
          className="bg-white w-[100px] h-[100px] rounded-2xl justify-center items-center"
          onPress={() => navigation.navigate("Market")}
        >
          <FontAwesome5 name="shopping-basket" size={48} color="#023535" />
          <Text className="text-[#023535] font-semibold mt-[5px] text-[12px]">MARKET</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white w-[100px] h-[100px] rounded-2xl justify-center items-center"
          onPress={() => navigation.navigate("Workshop")}
        >
          <FontAwesome5 name="tools" size={45} color="#023535" />
          <Text className="text-[#023535] font-semibold mt-[5px] text-[12px]">WORKSHOP</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
          className="bg-white w-[100px] h-[100px] rounded-2xl justify-center items-center"
          onPress={() => navigation.navigate("Profile")}
        >
          <FontAwesome5 name="user-alt" size={45} color="#023535" />
          <Text className="text-[#023535] font-semibold mt-[5px] text-[12px]">PROFILE</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity className="py-3 bg-white w-[300px] rounded-2xl" onPress={()=> navigation.navigate("Welkam")}>
        <Text className="text-xl font-bold text-center text-[#023535]">Welkam</Text>
      </TouchableOpacity> */}

    </View>
    </SafeAreaView>
  );
}


