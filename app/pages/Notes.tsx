import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, SafeAreaView, Modal } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import box from "../../assets/box.png";
import CardCamera from './CardCamera';
import { Animated } from 'react-native';

type Note = {
  title: string;
};

type TireInfo = {
  brand: string;
  size: string;
  type: string;
  dot: string;
  car: string;
  note: string;
  image?: string;
};

interface NotesProps {
  navigation: any;
  route: any;
}

export default function Notes({ navigation, route }: NotesProps) {
  const [tireInfo, setTireInfo] = useState<TireInfo[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [topBrands, setTopBrands] = useState<string[]>([]);
  const carInputRefs = useRef<Array<TextInput | null>>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (route.params?.tireToAdd) {
      const tireToAdd = route.params.tireToAdd as TireInfo;
      setTireInfo([tireToAdd, ...tireInfo]);
    }
  }, [route.params?.tireToAdd]);

  useEffect(() => {
    const fetchTopBrands = async () => {
      try {
        const savedTires = await AsyncStorage.getItem('scannedTires');
        if (savedTires) {
          const tires: TireInfo[] = JSON.parse(savedTires);
          const brandCounts: { [key: string]: number } = {};

          tires.forEach(tire => {
            if (brandCounts[tire.brand]) {
              brandCounts[tire.brand]++;
            } else {
              brandCounts[tire.brand] = 1;
            }
          });

          const sortedBrands = Object.keys(brandCounts).sort((a, b) => brandCounts[b] - brandCounts[a]);
          setTopBrands(sortedBrands.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch top brands:", error);
      }
    };

    fetchTopBrands();
  }, [tireInfo]);

  const handleAddTireInfo = () => {
    setTireInfo([{ brand: '', size: '', type: '', dot: '', car: '', note: '' }, ...tireInfo]);
  };

  const handleDeleteTireInfo = (index: number) => {
    Alert.alert("Delete Tire Information", "Would you like to delete this tire information?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          const updatedTireInfo = tireInfo.filter((_, i) => i !== index);
          setTireInfo(updatedTireInfo);
        }
      }
    ]);
  };

  const handleMarketSearch = (info: TireInfo) => {
    const searchQuery = [info.brand, info.size, info.type, info.dot].filter(Boolean).join(' ');
    console.log("Navigating to Market with query:", searchQuery);
    navigation.navigate('Market', { searchQuery });
  };

  const handleEditTireInfo = (index: number, field: string, value: string) => {
    const updatedTireInfo = tireInfo.map((info, i) => i === index ? { ...info, [field]: value } : info);
    setTireInfo(updatedTireInfo);
  };

  const handleCaptureImage = (imageUri: string) => {
    if (currentImageIndex !== null) {
      const updatedTireInfo = tireInfo.map((info, i) => (i === currentImageIndex ? { ...info, image: imageUri } : info));
      setTireInfo(updatedTireInfo);
      setIsCameraOpen(false);
    }
  };

  const handleOpenCamera = (index: number) => {
    setCurrentImageIndex(index);
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleOpenNotes = (index: number) => {
    const note = tireInfo[index].note;
    navigation.navigate('NotesPage', { title: 'Note', note, index, onSaveNote });
  };

  const onSaveNote = (index: number, note: string) => {
    const updatedTireInfo = tireInfo.map((info, i) => i === index ? { ...info, note } : info);
    setTireInfo(updatedTireInfo);
  };

  const handleEditCar = (index: number) => {
    navigation.navigate('CarNotes', { tireIndex: index, car: tireInfo[index].car });
  };

  const renderTireInfoCard = (info: TireInfo, index: number) => (
    <View key={index} className="p-2 bg-white rounded-lg">
      <View className="flex-row justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2 p-0.5 bg-[#023535] rounded-lg">
            <Text className="font-medium text-white w-1/3 px-2">Brand</Text>
            <TextInput
              value={info.brand}
              onChangeText={text => handleEditTireInfo(index, 'brand', text)}
              className="flex-1 text-white"
            />
          </View>
          <View className="flex-row items-center mb-2 p-0.5 bg-[#023535] rounded-lg">
            <Text className="font-medium text-white w-1/3 px-2">Size</Text>
            <TextInput
              value={info.size}
              onChangeText={text => handleEditTireInfo(index, 'size', text)}
              className="flex-1 text-white"
            />
          </View>
          <View className="flex-row items-center mb-2 p-0.5 bg-[#023535] rounded-lg">
            <Text className="font-medium text-white w-1/3 px-2">Type</Text>
            <TextInput
              value={info.type}
              onChangeText={text => handleEditTireInfo(index, 'type', text)}
              className="flex-1 text-white"
            />
          </View>
          <View className="flex-row items-center mb-2 p-0.5 bg-[#023535] rounded-lg">
            <Text className="font-medium text-white w-1/3 px-2">DOT</Text>
            <TextInput
              value={info.dot}
              onChangeText={text => handleEditTireInfo(index, 'dot', text)}
              className="flex-1 text-white"
            />
          </View>
        </View>
        <TouchableOpacity
          className="ml-4 w-[40%] h-[152px] bg-gray-300 rounded-lg justify-center items-center"
          onPress={() => handleOpenCamera(index)}
        >
          {info.image ? (
            <Image source={{ uri: info.image }} className="w-full h-full rounded-lg" />
          ) : (
            <MaterialCommunityIcons name="camera" size={40} color="white" />
          )}
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between mt-2">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => handleDeleteTireInfo(index)}
            className="p-2 bg-red-500 rounded-lg mr-2"
          >
            <MaterialCommunityIcons name="trash-can" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleMarketSearch(info)}
            className="p-2 bg-blue-500 rounded-lg mr-2"
          >
            <FontAwesome5 name="shopping-basket" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOpenNotes(index)}
            className="p-2 bg-yellow-500 rounded-lg"
          >
            <MaterialCommunityIcons name="note-text" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          <Text className="mr-2">{info.car ? 'Assigned' : 'Not Assigned'}</Text>
          <TextInput
            ref={(ref) => (carInputRefs.current[index] = ref)}
            value={info.car}
            onChangeText={text => handleEditTireInfo(index, 'car', text)}
            className="flex-1 text-white"
            editable={false} // Initially set to false
          />
          <TouchableOpacity
            onPress={() => handleEditCar(index)}
            className="p-2 bg-black rounded-lg"
          >
            <FontAwesome5 name="car" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="border-b border-[#023535] my-2" />
    </View>
  );

  const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 0.25],
      extrapolate: 'clamp',
    }),
    shadowRadius: scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 3.84],
      extrapolate: 'clamp',
    }),
    elevation: scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 5],
      extrapolate: 'clamp',
    }),
  };

  return (
    <View className="flex-1 bg-white">
      {/* Fixed Header Section */}
      <Animated.View style={[shadowStyle]} className="w-full bg-white absolute justify-center items-center top-0 z-10">
        <SafeAreaView className="w-[94%] bg-[#023535] rounded-full mb-2 mt-[50px]">
          <View className="flex-row justify-between items-center py-3 px-4">
            <Text className="text-xl font-bold text-white">Archive</Text>
            <TouchableOpacity
              className="p-1.5 bg-white rounded-full"
              onPress={() => navigation.navigate('History')}
            >
              <MaterialCommunityIcons name="history" size={20} color="#023535" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Spacer to avoid overlap with fixed header */}
      <View className="h-[60px]"></View>

      <ScrollView
        ref={scrollViewRef}
        className="flex bg-white px-4 pt-[65px]"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Top 3 Tire Brands Section */}
        <View className="mb-4">
          <View className="flex-row mb-4 items-center pr-2">
            <Text className="text-lg font-bold text-[#023535] mr-2">Top Tire Brands Scanned</Text>
            <View className="flex-1 border-b-4 border-[#023535] pt-1" />
          </View>
          <View className="flex-col px-2">
            {topBrands.length > 0 ? topBrands.concat(Array(3 - topBrands.length).fill('Not Defined')).map((brand, index) => (
              <View key={index} className="flex-row items-center mb-2 border border-[#023535] w-full rounded-2xl py-2 px-4">
                <Text className=" font-bold text-[#023535] pr-[30px]">{index + 1}</Text>
                <Text className=" flex-1 font-medium text-[#023535]">{brand}</Text>
              </View>
            )) : (
              Array(3).fill('Not Defined').map((brand, index) => (
                <View key={index} className="flex-row items-center mb-2 border border-[#023535] w-full rounded-2xl py-2 px-4">
                  <Text className=" font-bold text-[#023535] pr-[30px]">{index + 1}</Text>
                  <Text className=" flex-1 font-medium text-[#023535]">{brand}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Tire Information Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2 w-full rounded-full pr-2">
            <Text className="text-lg font-bold text-[#023535] mr-2">Tire Information Notes</Text>
            <View className="flex-1 border-b-4 border-[#023535] pt-1" />
            <TouchableOpacity
              className="p-2 border border-[#023535] rounded-full ml-2"
              onPress={handleAddTireInfo}
            >
              <MaterialCommunityIcons name="note-plus" size={20} color="#023535" />

            </TouchableOpacity>
          </View>

          {tireInfo.length === 0 && (
            <View className="items-center mt-4">
              <Image source={box} className="w-[200px] h-[200px]" />
              <Text className="text-center text-[#023535] mb-4 leading-8">
                Let's add a new note to your archive! You can start by going to <FontAwesome5 name="home" size={20} color="#023535" /> and pressing the <MaterialCommunityIcons name="tire" size={20} color="#023535" /> to scan a new Tire or add manually by pressing the <MaterialCommunityIcons name="plus" size={20} color="#023535" /> button!
              </Text>
            </View>
          )}

          {tireInfo.map((info, index) => renderTireInfoCard(info, index))}
        </View>
        <View className="h-[100px]" />
      </ScrollView>

      <Modal visible={isCameraOpen} animationType="slide">
        <CardCamera onImageCapture={handleCaptureImage} onClose={handleCloseCamera} />
      </Modal>
    </View>
  );
}
