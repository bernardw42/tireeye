import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import white from "../../assets/white.png";
import blob1 from "../../assets/blob1.png";
import blob2 from "../../assets/blob2.png";
import blob3 from "../../assets/blob3.png";

export default function Profile() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("user@example.com"); // Replace with actual email from backend
  const [password, setPassword] = useState("password123"); // Replace with actual password from backend
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSaveProfile = () => {
    // Save the email and password to the backend
    setHasUnsavedChanges(false);
    Alert.alert("Profile Saved", "Your profile has been saved.");
  };

  const handleBackAction = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have not saved your credentials, would you like to save?",
        [
          { text: "No", onPress: () => navigation.goBack(), style: "cancel" },
          { text: "Yes", onPress: () => handleSaveProfile() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have not saved your credentials, would you like to save?",
        [
          { text: "No", onPress: () => navigation.navigate("Welkam"), style: "cancel" },
          { text: "Yes", onPress: () => { handleSaveProfile(); navigation.navigate("Welkam"); } }
        ]
      );
    } else {
      navigation.navigate("Welkam");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-[#023535]">
        <Image source={blob1} className="absolute top-[-50px] right-[-110px] transform -translate-y-1/2 w-[300px] h-[400px]" resizeMode="contain" />
        <Image source={blob2} className="absolute top-[25%] left-[-130px] w-[300px] h-[400px]" resizeMode="contain" />
        <Image source={blob3} className="absolute bottom-[-80px] right-[-100px] transform -translate-y-1/2 w-[500px] h-[400px]" resizeMode="contain" />

        <View className="flex justify-start">
          <TouchableOpacity className="pt-[50px] ml-[16px]" onPress={handleBackAction}>
            <AntDesign name="arrowleft" size={35} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center gap-y-[40px] pt-[30px]">
          <FontAwesome5 name="user-alt" size={160} color="#FFFFFF" />
          <View className="form space-y-2 items-center">
            <Text className="ml-1 text-white">USERNAME</Text>
            <View className="flex-row items-center bg-gray-100 rounded-2xl w-[300px] px-2">
              <TextInput
                className={`py-2 flex-1 text-gray-700 ${isEditingEmail ? 'bg-white' : 'bg-gray-100'} rounded-2xl`}
                value={email}
                onChangeText={(text) => { setEmail(text); setHasUnsavedChanges(true); }}
                editable={isEditingEmail}
                placeholder="Enter Email"
              />
              <TouchableOpacity onPress={() => setIsEditingEmail(!isEditingEmail)} className="p-2">
                <Feather name="edit" size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <Text className="ml-1 text-white">PASSWORD</Text>
            <View className="flex-row items-center bg-gray-100 rounded-2xl w-[300px] px-2">
              <TextInput
                className={`py-2 flex-1 text-gray-700 ${isEditingPassword ? 'bg-white' : 'bg-gray-100'} rounded-2xl`}
                value={password}
                onChangeText={(text) => { setPassword(text); setHasUnsavedChanges(true); }}
                editable={isEditingPassword}
                placeholder="Enter Password"
                secureTextEntry
              />
              <TouchableOpacity onPress={() => setIsEditingPassword(!isEditingPassword)} className="p-2">
                <Feather name="edit" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity className="py-3 bg-white w-[300px] rounded-2xl" onPress={handleSaveProfile}>
            <Text className="font-bold text-center text-[#023535]">SAVE PROFILE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white w-[100px] h-[100px] rounded-2xl justify-center items-center"
            onPress={handleLogout}
          >
            <MaterialIcons name="exit-to-app" size={45} color="#023535" />
            <Text className="text-[#023535] font-semibold mt-[5px]">LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
