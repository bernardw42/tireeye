import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';


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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 justify-start items-start bg-gray-100 m-5">
        <View className="flex justify-start">
                <TouchableOpacity className="pt-[40px] ml-[16px]" onPress={()=> navigation.goBack()}>
                    <AntDesign name="arrowleft" size={35} color="black" />
                </TouchableOpacity>
        </View>
        <Text className="text-2xl font-bold mb-4">Note</Text>
        <TextInput
          className="w-full p-4 border border-gray-400 rounded-lg mb-5 text-lg text-gray-600"
          autoFocus={true}
          maxLength={40}
          value={note.title}
          placeholder="Title"
          onChangeText={(text) => setNote({ ...note, title: text })}
        />
        <TextInput
          className="w-full p-4 border border-gray-400 rounded-lg text-lg h-40"
          multiline={true}
          value={note.note}
          placeholder="Description"
          onChangeText={(text) => setNote({ ...note, note: text })}
        />
        <View className="w-full flex-row justify-center mt-2 absolute bottom-0">
          <TouchableOpacity
            className="rounded-lg w-20 h-20 items-center justify-center m-2 bg-blue-700"
            onPress={() => console.log("Save note")}
          >
            <Feather name="save" size={29} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg w-20 h-20 items-center justify-center m-2 bg-red-700"
            onPress={() => console.log("Delete note")}
          >
            <Feather name="trash-2" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}










