import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tire1 from "../../assets/tire1.jpg";
import tire2 from "../../assets/tire2.jpg";
import tire3 from "../../assets/tire3.jpg";
import blob1 from "../../assets/blob1.png";
import blob2 from "../../assets/blob2.png";
import blob3 from "../../assets/blob3.png";

type TireInfo = {
    brand: string;
    size: string;
    type: string;
    dot: string;
    image?: string; // Ensure the image is treated as a URI string
};

const mockData: TireInfo[] = [
    { brand: "Bridgestone", size: "215/55R17", type: "All-Season", dot: "X3C4 D6T9", image: Image.resolveAssetSource(tire1).uri },
    { brand: "Michelin", size: "225/50R18", type: "Performance", dot: "B8T7 L3N1", image: Image.resolveAssetSource(tire2).uri },
    { brand: "Pirelli", size: "205/60R16", type: "Touring", dot: "P4C1 M9D6", image: Image.resolveAssetSource(tire3).uri },
];

export default function History() {
    const navigation = useNavigation();
    const [scannedTires, setScannedTires] = useState<TireInfo[]>(mockData); // Start with mockData

    useEffect(() => {
        const loadData = async () => {
            try {
                const savedTires = await AsyncStorage.getItem('scannedTires');
                if (savedTires) {
                    const parsedTires = JSON.parse(savedTires);
                    if (parsedTires.length === 0) {
                        setScannedTires(mockData);
                    } else {
                        setScannedTires(parsedTires);
                    }
                } else {
                    setScannedTires(mockData);
                }
            } catch (error) {
                console.error("Failed to load scanned tires:", error);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const saveData = async () => {
            try {
                await AsyncStorage.setItem('scannedTires', JSON.stringify(scannedTires));
            } catch (error) {
                console.error("Failed to save scanned tires:", error);
            }
        };

        saveData();
    }, [scannedTires]);

    const handleAddToNotes = (tire: TireInfo) => {
        Alert.alert(
            "Add to Notes",
            "Would you like to add this tire information to the Archive?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes",
                    onPress: () => {
                        const tireToAdd = {
                            ...tire,
                            image: tire.image // Ensure the image URI is correctly resolved
                        };
                        navigation.navigate('Notes', { tireToAdd });
                    }
                }
            ]
        );
    };

    const handleDeleteTire = (index: number) => {
        Alert.alert("Delete Tire Information", "Would you like to delete this tire information?", [
            { text: "No", style: "cancel" },
            {
                text: "Yes",
                onPress: () => {
                    const updatedTires = scannedTires.filter((_, i) => i !== index);
                    setScannedTires(updatedTires);
                }
            }
        ]);
    };

    const handleRefreshData = async () => {
        try {
            await AsyncStorage.setItem('scannedTires', JSON.stringify(mockData));
            setScannedTires(mockData);
        } catch (error) {
            console.error("Failed to refresh scanned tires:", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#023535] px-4 pt-[50px]">
            <Image source={blob1} className="absolute top-[-50px] right-[-110px] transform -translate-y-1/2 w-[300px] h-[400px]" resizeMode="contain"/>
            <Image source={blob2} className="absolute top-[25%] left-[-130px] w-[300px] h-[400px]" resizeMode="contain"/>
            <Image source={blob3} className="absolute bottom-[-80px] right-[-100px] transform -translate-y-1/2 w-[500px] h-[400px]" resizeMode="contain"/>
            <View className="flex-row justify-between items-center w-full bg-white rounded-full mb-6">
                <TouchableOpacity className="px-4 py-2" onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={26} color="#023535" />
                </TouchableOpacity>
                <Text className="font-bold text-2xl text-[#023535] justify-center">History</Text>
                <TouchableOpacity className="flex px-4 py-2" onPress={handleRefreshData}>
                    <MaterialIcons name="refresh" size={26} color="#023535" />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {[...scannedTires].reverse().map((info, index) => (
                    <View key={index} className="p-2 bg-white rounded-lg mb-4">
                        <View className="flex-row justify-between">
                            <View className="flex-1">
                                <View className="flex-row items-center mb-2 p-1.5 bg-[#023535] rounded-lg">
                                    <Text className="font-medium text-white w-1/3 px-2">Brand</Text>
                                    <Text className="flex-1 text-white">{info.brand}</Text>
                                </View>
                                <View className="flex-row items-center mb-2 p-1.5 bg-[#023535] rounded-lg">
                                    <Text className="font-medium text-white w-1/3 px-2">Size</Text>
                                    <Text className="flex-1 text-white">{info.size}</Text>
                                </View>
                                <View className="flex-row items-center mb-2 p-1.5 bg-[#023535] rounded-lg">
                                    <Text className="font-medium text-white w-1/3 px-2">Type</Text>
                                    <Text className="flex-1 text-white">{info.type}</Text>
                                </View>
                                <View className="flex-row items-center mb-2 p-1.5 bg-[#023535] rounded-lg">
                                    <Text className="font-medium text-white w-1/3 px-2">DOT</Text>
                                    <Text className="flex-1 text-white">{info.dot}</Text>
                                </View>
                            </View>
                            <TouchableOpacity className="ml-4 w-[40%] h-[150px] bg-gray-300 rounded-lg justify-center items-center">
                                {info.image ? (
                                    <Image source={{ uri: info.image }} className="w-full h-full rounded-lg" />
                                ) : (
                                    <Text>No Image</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row justify-center mt-1 mb-1">
                            <TouchableOpacity
                                onPress={() => handleDeleteTire(index)}
                                className="py-2 w-1/2 border border-[#023535] justify-center items-center rounded-lg mr-2"
                            >
                                <MaterialCommunityIcons name="trash-can" size={20} color="#023535" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleAddToNotes(info)}
                                className="py-2 w-1/2 justify-center items-center border border-[#023535] rounded-lg"
                            >
                                <MaterialIcons name="add-circle" size={20} color="#023535" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
