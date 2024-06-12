import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView, SafeAreaView, Modal } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import blob1 from "../../assets/blob1.png";
import blob2 from "../../assets/blob2.png";
import blob3 from "../../assets/blob3.png";
import CardCamera from './CardCamera';

type CarDetails = {
    brand: string;
    model: string;
    year: string;
    licensePlate: string;
    color: string;
    image?: string;
};

export default function CarNotes({ route }: { route: any }) {
    const navigation = useNavigation();
    const { tireIndex, car } = route.params;
    const [carDetails, setCarDetails] = useState<CarDetails>({
        brand: '',
        model: '',
        year: '',
        licensePlate: '',
        color: '',
        image: '',
    });
    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

    const handleEditCarDetail = (field: keyof CarDetails, value: string) => {
        setCarDetails({ ...carDetails, [field]: value });
    };

    const handleOpenCamera = () => {
        setIsCameraOpen(true);
    };

    const handleCloseCamera = () => {
        setIsCameraOpen(false);
    };

    const handleCaptureImage = (imageUri: string) => {
        setCarDetails({ ...carDetails, image: imageUri });
        setIsCameraOpen(false);
    };

    const handleDeleteCarDetails = () => {
        Alert.alert("Delete Car Details", "Are you sure you want to delete all car details?", [
            { text: "No", style: "cancel" },
            {
                text: "Yes",
                onPress: () => {
                    setCarDetails({
                        brand: '',
                        model: '',
                        year: '',
                        licensePlate: '',
                        color: '',
                        image: '',
                    });
                }
            }
        ]);
    };

    const handleSaveCarDetails = () => {
        // Logic to save car details
        navigation.navigate('Notes', { tireIndex, carDetails });
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
                <Text className="font-bold text-2xl text-[#023535] justify-center pr-6">Car Note</Text>
                <View className="px-4 py-2" />
            </View>
            <ScrollView className="p-2">
                <View className="flex-row items-center mb-2 p-1.5 bg-white rounded-lg">
                    <Text className="font-medium text-[#023535] w-1/3 px-2">Brand</Text>
                    <TextInput
                        value={carDetails.brand}
                        onChangeText={text => handleEditCarDetail('brand', text)}
                        className="flex-1 text-black"
                    />
                </View>
                <View className="flex-row items-center mb-2 p-1.5 border bg-white rounded-lg">
                    <Text className="font-medium text-[#023535] w-1/3 px-2">Model</Text>
                    <TextInput
                        value={carDetails.model}
                        onChangeText={text => handleEditCarDetail('model', text)}
                        className="flex-1 text-black"
                    />
                </View>
                <View className="flex-row items-center mb-2 p-1.5 border bg-white rounded-lg">
                    <Text className="font-medium text-[#023535] w-1/3 px-2">Year</Text>
                    <TextInput
                        value={carDetails.year}
                        onChangeText={text => handleEditCarDetail('year', text)}
                        className="flex-1 text-black"
                    />
                </View>
                <View className="flex-row items-center mb-2 p-1.5 border bg-white rounded-lg">
                    <Text className="font-medium text-[#023535] w-1/3 px-2">License Plate</Text>
                    <TextInput
                        value={carDetails.licensePlate}
                        onChangeText={text => handleEditCarDetail('licensePlate', text)}
                        className="flex-1 text-black"
                    />
                </View>
                <View className="flex-row items-center mb-2 p-1.5 border bg-white rounded-lg">
                    <Text className="font-medium text-[#023535] w-1/3 px-2">Color</Text>
                    <TextInput
                        value={carDetails.color}
                        onChangeText={text => handleEditCarDetail('color', text)}
                        className="flex-1 text-black"
                    />
                </View>
                <TouchableOpacity className="w-full h-[200px] bg-gray-300 rounded-lg justify-center items-center mt-4" onPress={handleOpenCamera}>
                    {carDetails.image ? (
                        <Image source={{ uri: carDetails.image }} className="w-full h-full rounded-lg" />
                    ) : (
                        <Text>Tap to add image</Text>
                    )}
                </TouchableOpacity>
                <View className="flex-row justify-between mt-4">
                    <TouchableOpacity onPress={handleDeleteCarDetails} className="py-4 w-[48%] justify-center items-center rounded-lg bg-red-500 mr-2">
                        <MaterialCommunityIcons name="trash-can" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSaveCarDetails} className="py-4 w-[48%] justify-center items-center rounded-lg bg-blue-500">
                        <MaterialIcons name="save" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={isCameraOpen} animationType="slide">
                <CardCamera onImageCapture={handleCaptureImage} onClose={handleCloseCamera} />
            </Modal>
        </SafeAreaView>
    );
}
