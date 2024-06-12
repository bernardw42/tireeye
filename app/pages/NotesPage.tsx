import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import blob1 from "../../assets/blob1.png";
import blob2 from "../../assets/blob2.png";
import blob3 from "../../assets/blob3.png";

type RootStackParamList = {
  NotesPage: { note: { title: string; note: string } };
};

type NotesPageRouteProp = RouteProp<RootStackParamList, 'NotesPage'>;
type NotesPageNavigationProp = StackNavigationProp<RootStackParamList, 'NotesPage'>;

interface NotesPageProps {
  route: NotesPageRouteProp;
  navigation: NotesPageNavigationProp;
}

export default function NotesPage({ route, navigation }: NotesPageProps) {
  const [note, setNote] = useState({
    title: "",
    note: "",
  });

  useEffect(() => {
    if (route.params?.note) {
      setNote(route.params.note);
    }
  }, [route.params?.note]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View className="w-full flex-row justify-end pr-5">
            <TouchableOpacity onPress={() => console.log("Modal would open")}>
              <Feather name="bell" size={24} color="white" />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation, note]);

  const handleSaveNote = () => {
    // Logic to save the note
    console.log("Save note", note);
    navigation.goBack();
  };

  const handleDeleteNote = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          setNote({
            title: "",
            note: "",
          });
        }
      }
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-[#023535] px-4 pb-4 pt-[50px]">
        <Image source={blob1} className="absolute top-[-50px] right-[-110px] transform -translate-y-1/2 w-[300px] h-[400px]" resizeMode="contain" />
        <Image source={blob2} className="absolute top-[25%] left-[-130px] w-[300px] h-[400px]" resizeMode="contain" />
        <Image source={blob3} className="absolute bottom-[-80px] right-[-100px] transform -translate-y-1/2 w-[500px] h-[400px]" resizeMode="contain" />
        <View className="flex-row justify-between items-center w-full bg-white rounded-full mb-6">
              <TouchableOpacity className="px-4 py-2" onPress={() => navigation.goBack()}>
                  <AntDesign name="arrowleft" size={26} color="#023535" />
              </TouchableOpacity>
              <Text className="font-bold text-2xl text-[#023535] justify-center pr-6">Note</Text>
              <View className="px-4 py-2" />
        </View>
        <ScrollView className="px-2">
          <TextInput
            className="w-full bg-white p-4 border border-gray-400 rounded-lg mb-5 h-[400px] text-left"
            multiline={true}
            textAlignVertical="top"
            value={note.note}
            placeholder="Your Note Starts Here!"
            onChangeText={(text) => setNote({ ...note, note: text })}
          />
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity onPress={handleDeleteNote} className="py-2 w-[48%] justify-center items-center rounded-lg bg-red-500">
              <Feather name="trash-2" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSaveNote} className="py-2 w-[48%] justify-center items-center rounded-lg bg-blue-500">
              <Feather name="save" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
