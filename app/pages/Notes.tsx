import { View, Text, TouchableOpacity, FlatList, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";

type Note = {
    title: string;
};

type TireInfo = {
    brand: string;
    size: string;
    type: string;
    dot: string;
    car: string;
};

interface NotesProps {
    navigation: any;
}

export default function Notes({ navigation }: NotesProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNoteTitle, setNewNoteTitle] = useState<string>('');
    const [showAddNote, setShowAddNote] = useState<boolean>(false);
    const [tireInfo, setTireInfo] = useState<TireInfo[]>([]);
    const [newTireInfo, setNewTireInfo] = useState<TireInfo>({ brand: '', size: '', type: '', dot: '', car: '' });

    const handleAddNote = () => {
        if (newNoteTitle.trim()) {
            setNotes([...notes, { title: newNoteTitle }]);
            setNewNoteTitle('');
            setShowAddNote(false);
        }
    };

    const handleAddTireInfo = () => {
        setTireInfo([...tireInfo, newTireInfo]);
        setNewTireInfo({ brand: '', size: '', type: '', dot: '', car: '' });
    };

    const renderNoteItem = ({ item }: { item: Note }) => (
        <TouchableOpacity
            className="w-40 h-40 m-2 bg-white rounded-lg justify-center items-center"
            onPress={() => navigation.navigate('NotesPage', { title: item.title })}
        >
            <Text>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderTireInfoCard = (info: TireInfo, index: number) => (
        <View key={index} className="p-4 bg-white rounded-lg mb-4">
            <Text>Brand: {info.brand}</Text>
            <Text>Size: {info.size}</Text>
            <Text>Type: {info.type}</Text>
            <Text>DOT: {info.dot}</Text>
            <Text>Car: {info.car}</Text>
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-green-400 p-4">
            {/* Header Section */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold">Notes</Text>
                <TouchableOpacity
                    className="p-2 bg-blue-500 rounded-lg"
                    onPress={() => navigation.navigate('History')}
                >
                    <Text className="text-white font-bold">History</Text>
                </TouchableOpacity>
            </View>

            {/* Top 3 Tire Brands Section */}
            <View className="mb-4">
                <Text className="text-xl font-bold mb-2">Top 3 Tire Brands</Text>
                <View>
                    <Text>1. </Text>
                    <Text>2. </Text>
                    <Text>3. </Text>
                </View>
            </View>

            {/* Notes Carousel Section */}
            <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xl font-bold">Notes</Text>
                    <TouchableOpacity
                        className="p-2 bg-blue-500 rounded-lg"
                        onPress={() => setShowAddNote(true)}
                    >
                        <Text className="text-white font-bold">Add Note</Text>
                    </TouchableOpacity>
                </View>
                {showAddNote && (
                    <View className="flex-row mb-4">
                        <TextInput
                            value={newNoteTitle}
                            onChangeText={setNewNoteTitle}
                            placeholder="Enter note title"
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                        />
                        <TouchableOpacity onPress={handleAddNote} className="ml-2 p-2 bg-blue-500 rounded-lg">
                            <Text className="text-white font-bold">Add</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <FlatList
                    horizontal
                    data={notes}
                    renderItem={renderNoteItem}
                    keyExtractor={(item, index) => index.toString()}
                    className="flex-1"
                />
            </View>

            {/* Tire Information Section */}
            <View className="mb-4">
                <Text className="text-xl font-bold mb-2">Tire Information</Text>
                {tireInfo.map((info, index) => renderTireInfoCard(info, index))}
                <View className="p-4 bg-white rounded-lg mb-4">
                    <TextInput
                        placeholder="Brand"
                        value={newTireInfo.brand}
                        onChangeText={text => setNewTireInfo({ ...newTireInfo, brand: text })}
                        className="mb-2 p-2 border border-gray-300 rounded-lg"
                    />
                    <TextInput
                        placeholder="Size"
                        value={newTireInfo.size}
                        onChangeText={text => setNewTireInfo({ ...newTireInfo, size: text })}
                        className="mb-2 p-2 border border-gray-300 rounded-lg"
                    />
                    <TextInput
                        placeholder="Type"
                        value={newTireInfo.type}
                        onChangeText={text => setNewTireInfo({ ...newTireInfo, type: text })}
                        className="mb-2 p-2 border border-gray-300 rounded-lg"
                    />
                    <TextInput
                        placeholder="DOT"
                        value={newTireInfo.dot}
                        onChangeText={text => setNewTireInfo({ ...newTireInfo, dot: text })}
                        className="mb-2 p-2 border border-gray-300 rounded-lg"
                    />
                    <TextInput
                        placeholder="Car"
                        value={newTireInfo.car}
                        onChangeText={text => setNewTireInfo({ ...newTireInfo, car: text })}
                        className="mb-2 p-2 border border-gray-300 rounded-lg"
                    />
                    <TouchableOpacity onPress={handleAddTireInfo} className="p-2 bg-blue-500 rounded-lg">
                        <Text className="text-white font-bold">Add Tire Information</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
