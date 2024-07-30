import React from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AppNav from "./app/components/AppNav"
import Home from './app/pages/Home';
import Market from './app/pages/Market';
import Notes from './app/pages/Notes';
import Workshop from './app/pages/Workshop';

// const Stack = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <View className='flex-1 bg-white'>
      <AppNav></AppNav>
    </View>
  );
};

export default App;