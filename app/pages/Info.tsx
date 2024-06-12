import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

type TireInfo = {
  brand: string;
  size: string;
  type: string;
  dot: string;
  image: string;
};

const Info = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params as { imageUri: string };

  // Mock data for analysis result
  const tireInfo: TireInfo = {
    brand: "MockBrand",
    size: "225/50R17",
    type: "All-Season",
    dot: "DOT123456",
    image: imageUri,
  };

  useEffect(() => {
    // Add to history on component mount
    const addToHistory = async () => {
      try {
        const existingHistory = await AsyncStorage.getItem('scannedTires');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        const alreadyExists = history.some(
          (item: TireInfo) =>
            item.brand === tireInfo.brand &&
            item.size === tireInfo.size &&
            item.type === tireInfo.type &&
            item.dot === tireInfo.dot &&
            item.image === tireInfo.image
        );

        if (!alreadyExists) {
          history.push(tireInfo);
          await AsyncStorage.setItem('scannedTires', JSON.stringify(history));
        }
      } catch (error) {
        console.error("Failed to add to history:", error);
      }
    };

    addToHistory();
  }, []);

  const copyToClipboard = () => {
    const textToCopy = `${tireInfo.brand} ${tireInfo.size} ${tireInfo.type} ${tireInfo.dot}`;
    Clipboard.setStringAsync(textToCopy);
    Alert.alert("Copied to Clipboard", textToCopy);
  };
  

  const addToNotes = async () => {
    Alert.alert(
      "Add to Notes",
      "Would you like to add this tire information to the Archive?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const existingNotes = await AsyncStorage.getItem('scannedTires');
              const notes = existingNotes ? JSON.parse(existingNotes) : [];
              const alreadyExists = notes.some(
                (item: TireInfo) =>
                  item.brand === tireInfo.brand &&
                  item.size === tireInfo.size &&
                  item.type === tireInfo.type &&
                  item.dot === tireInfo.dot &&
                  item.image === tireInfo.image
              );

              if (!alreadyExists) {
                notes.push(tireInfo);
                await AsyncStorage.setItem('scannedTires', JSON.stringify(notes));
              }
              Alert.alert("Added to Notes", "Tire information has been added to notes.");
              navigation.navigate('Notes', { tireToAdd: tireInfo });
            } catch (error) {
              console.error("Failed to add to notes:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Image source={{ uri: tireInfo.image }} className="w-full h-[35%] rounded-b-3xl" />
      <View className="flex-1 px-6">
        {/* Buttons */}
        <View className="flex-row justify-between mt-4 mb-2">
          <TouchableOpacity
            className="bg-[#023535] p-2 rounded-2xl"
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="camera-retro" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#023535] p-2 rounded-2xl"
            onPress={copyToClipboard}
          >
            <MaterialCommunityIcons name="content-copy" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Info Bars */}
        <View className="space-y-1">
          <View>
            <Text className="text-[#023535] font-bold text-center text-lg mb-1">Brand</Text>
            <View className="border border-[#023535] p-2 rounded-2xl">
              <Text className="text-[#023535] text-center">{tireInfo.brand}</Text>
            </View>
          </View>
          <View>
            <Text className="text-[#023535] font-bold text-center text-lg mb-1">Size</Text>
            <View className="border border-[#023535] p-2 rounded-2xl">
              <Text className="text-[#023535] text-center">{tireInfo.size}</Text>
            </View>
          </View>
          <View>
            <Text className="text-[#023535] font-bold text-center text-lg mb-1">Type</Text>
            <View className="border border-[#023535] p-2 rounded-2xl">
              <Text className="text-[#023535] text-center">{tireInfo.type}</Text>
            </View>
          </View>
          <View>
            <Text className="text-[#023535] font-bold text-center text-lg mb-1">DOT</Text>
            <View className="border border-[#023535] p-2 rounded-2xl">
              <Text className="text-[#023535] text-center">{tireInfo.dot}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="bg-[#023535] p-3 rounded-2xl"
            onPress={() => navigation.navigate('Home')}
          >
            <MaterialCommunityIcons name="trash-can" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#023535] p-3 rounded-2xl"
            onPress={addToNotes}
          >
            <MaterialIcons name="note-add" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#023535] p-3 rounded-2xl"
            onPress={() => navigation.navigate('Market', { searchQuery: `${tireInfo.brand} ${tireInfo.size} ${tireInfo.type} ${tireInfo.dot}` })}
          >
            <FontAwesome5 name="search" size={23} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Info;
