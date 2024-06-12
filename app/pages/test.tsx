import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, ScrollView, Image, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';

type Note = {
    title: string;
};

type TireInfo = {
    brand: string;
    size: string;
    type: string;
    dot: string;
    car: string;
    image: string | null;
    note: string;
};

interface NotesProps {}

export default function Notes({}: NotesProps) {
    const navigation = useNavigation();
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNoteTitle, setNewNoteTitle] = useState<string>('');
    const [showAddNote, setShowAddNote] = useState<boolean>(false);
    const [tireInfo, setTireInfo] = useState<TireInfo[]>([]);
    const [newTireInfo, setNewTireInfo] = useState<TireInfo>({ brand: '', size: '', type: '', dot: '', car: '', image: null, note: '' });

    const handleAddNote = () => {
        if (newNoteTitle.trim()) {
            setNotes([...notes, { title: newNoteTitle }]);
            setNewNoteTitle('');
            setShowAddNote(false);
        }
    };

    const handleAddTireInfo = () => {
        setTireInfo([...tireInfo, newTireInfo]);
        setNewTireInfo({ brand: '', size: '', type: '', dot: '', car: '', image: null, note: '' });
    };

    const handleDeleteTireInfo = (index: number) => {
        Alert.alert(
            "Delete Tire Information",
            "Would you like to delete this tire information?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes",
                    onPress: () => {
                        const newTireInfo = tireInfo.filter((_, i) => i !== index);
                        setTireInfo(newTireInfo);
                    }
                }
            ]
        );
    };

    const handlePickImage = async (index: number) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access the gallery is required!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (!pickerResult.cancelled) {
            const updatedTireInfo = [...tireInfo];
            updatedTireInfo[index].image = pickerResult.uri;
            setTireInfo(updatedTireInfo);
        }
    };

    const handleTakePicture = async (index: number) => {
        const permissionResult = await Camera.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access the camera is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled) {
            const updatedTireInfo = [...tireInfo];
            updatedTireInfo[index].image = result.uri;
            setTireInfo(updatedTireInfo);
        }
    };

    const renderTireInfoCard = (info: TireInfo, index: number) => (
        <View key={index} className="p-4 bg-white rounded-lg mb-4">
            <View className="flex-row">
                <View className="flex-1">
                    <TouchableOpacity onPress={() => handlePickImage(index)}>
                        {info.image ? (
                            <Image source={{ uri: info.image }} style={{ width: 100, height: 100, marginRight: 10 }} />
                        ) : (
                            <View style={{ width: 100, height: 100, marginRight: 10, backgroundColor: '#e0e0e0' }} />
                        )}
                    </TouchableOpacity>
                </View>
                <View className="flex-2 justify-between">
                    <TextInput
                        placeholder="Brand"
                        value={info.brand}
                        onChangeText={text => {
                            const updatedTireInfo = [...tireInfo];
                            updatedTireInfo[index].brand = text;
                            setTireInfo(updatedTireInfo);
                        }}
                        className="mb-2 p-2 border border-gray-300 rounded-lg"
                    />
                    <TextInput
                        placeholder="Size"
                        value={info.size}
                        onChangeText={text => {
                            const updatedTireInfo = [...tireInfo];
                            updatedTireInfo[index].size = text;
                            setTireInfo(updatedTireInfo);
                        }}
                        className="mb-2 p-2 border border-gray-300 rounded-lg"
                    />
                    <TextInput
                        placeholder="Type"
                        value={info.type}
                        onChangeText={text => {
                            const updatedTireInfo = [...tireInfo];
                            updatedTireInfo[index].type = text;
                            setTireInfo(updatedTireInfo);
                        }}
                        className="mb-2 p-2 border border-gray-300 rounded-lg"
                    />
                    <TextInput
                        placeholder="DOT"
                        value={info.dot}
                        onChangeText={text => {
                            const updatedTireInfo = [...tireInfo];
                            updatedTireInfo[index].dot = text;
                            setTireInfo(updatedTireInfo);
                        }}
                        className="mb-2 p-2 border border-gray-300 rounded-lg"
                    />
                    <TextInput
                        placeholder="Car"
                        value={info.car}
                        onChangeText={text => {
                            const updatedTireInfo = [...tireInfo];
                            updatedTireInfo[index].car = text;
                            setTireInfo(updatedTireInfo);
                        }}
                        className="mb-2 p-2 border border-gray-300 rounded-lg"
                    />
                </View>
            </View>
            <View className="flex-row justify-between mt-4">
                <TouchableOpacity onPress={() => handleDeleteTireInfo(index)} className="bg-red-500 p-2 rounded-lg">
                    <Text className="text-white">Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Market', { searchQuery: `${info.brand} ${info.size} ${info.type} ${info.dot}` })} className="bg-blue-500 p-2 rounded-lg">
                    <Text className="text-white">Market</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('NotesPage', { note: info.note })} className="bg-blue-500 p-2 rounded-lg">
                    <Text className="text-white">Note</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    const updatedTireInfo = [...tireInfo];
                    updatedTireInfo[index].car = info.car === 'Not Assigned' ? '' : 'Not Assigned';
                    setTireInfo(updatedTireInfo);
                }} className="bg-blue-500 p-2 rounded-lg">
                    <Text className="text-white">{info.car === 'Not Assigned' ? 'Assign Car' : 'Unassign Car'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView className="flex bg-white px-4 pt-[50px]"> 
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold">Archive</Text>
                <TouchableOpacity
                    className="p-2 bg-blue-500 rounded-lg"
                    onPress={() => navigation.navigate('History')}
                >
                    <Text className="text-white font-bold">History</Text>
                </TouchableOpacity>
            </View>

            <View className="mb-4 items-center">
                <Text className="text-xl font-bold mb-2 text-center">Top 3 Tire Brands</Text>
                <View className="w-full px-4">
                    <Text className="text-left">1. -</Text>
                    <Text className="text-left">2. -</Text>
                    <Text className="text-left">3. -</Text>
                </View>
            </View>

            <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xl font-bold">Tire Information</Text>
                    <TouchableOpacity onPress={handleAddTireInfo} className="p-2 bg-blue-500 rounded-lg">
                        <Text className="text-white font-bold">Add New Card</Text>
                    </TouchableOpacity>
                </View>
                {tireInfo.map((info, index) => renderTireInfoCard(info, index))}
                <View className="h-[80px]" /> {/* Margin for the bottom */}
            </View>
        </ScrollView>
    );
}
