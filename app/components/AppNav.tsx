import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Welkam from "../pages/Welkam";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Notes from "../pages/Notes";
import Market from "../pages/Market";
import Workshop from "../pages/Workshop";
import Scan from "../pages/Scan";
import Profile from "../pages/Profile";
import Info from "../pages/Info"
import History from "../pages/History"


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function LoginNav() {
    return (
        <Tab.Navigator>
            <Tab.Screen 
                name="Home" 
                component={Home} 
                options={{ 
                    headerShown: false, 
                    tabBarStyle: { display: "none" } 
                }} 
            />
            <Tab.Screen 
                name="Notes" 
                component={Notes} 
                options={{ headerShown: false }} 
            />
            <Tab.Screen 
                name="Market" 
                component={Market} 
                options={{ headerShown: false }} 
            />
            <Tab.Screen 
                name="Workshop" 
                component={Workshop} 
                options={{ headerShown: false }} 
            />
        </Tab.Navigator>
    );
}

export default function AppNav() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welkam">
                <Stack.Screen 
                    name="HomeTabs" 
                    component={LoginNav} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Welkam" 
                    component={Welkam} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Login" 
                    component={Login} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Register" 
                    component={Register} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Scan" 
                    component={Scan} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Profile" 
                    component={Profile} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Info" 
                    component={Info} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="History" 
                    component={History} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
