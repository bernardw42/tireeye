import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { StackHeaderProps } from '@react-navigation/stack';

const Navbar: React.FC<StackHeaderProps> = ({ navigation }) => {
  const navigate = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <View className="absolute top-0 w-full bg-white flex-row justify-around p-4 shadow-2xl">
      <TouchableOpacity onPress={() => navigate('Home')} className="items-center">
        <FontAwesome5 name="home" size={24} color="black" />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate('Notes')} className="items-center">
        <MaterialCommunityIcons name="note-edit" size={24} color="black" />
        <Text>Notes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate('Market')} className="items-center">
        <FontAwesome5 name="shopping-basket" size={24} color="black" />
        <Text>Market</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate('Workshop')} className="items-center">
        <MaterialCommunityIcons name="tools" size={24} color="black" />
        <Text>Workshop</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;



