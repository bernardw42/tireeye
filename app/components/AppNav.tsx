import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Dimensions, Keyboard, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Welkam from "../pages/Welkam";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Notes from "../pages/Notes";
import Market from "../pages/Market";
import Workshop from "../pages/Workshop";
import Scan from "../pages/Scan";
import Profile from "../pages/Profile";
import Info from "../pages/Info";
import History from "../pages/History";
import NotesPage from "../pages/NotesPage";
import CarNotes from "../pages/CarNotes";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const { width } = Dimensions.get("window");
    const tabWidth = width * 0.85 / state.routes.length;
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    if (state.routes[state.index].name === 'Home' || isKeyboardVisible) {
        return null;
    }

    return (
        <View className="flex-row justify-around absolute bottom-0 h-[68px] bg-white rounded-t-2xl" style={{ width: '85%', alignSelf: 'center', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 6, elevation: 10 }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                let iconName;
                let IconComponent;
                let iconSize;

                if (route.name === 'Home') {
                    iconName = "home";
                    IconComponent = FontAwesome5;
                    iconSize = 25;
                } else if (route.name === 'Notes') {
                    iconName = "note-edit";
                    IconComponent = MaterialCommunityIcons;
                    iconSize = 28;
                } else if (route.name === 'Market') {
                    iconName = "shopping-basket";
                    IconComponent = FontAwesome5;
                    iconSize = 25;
                } else if (route.name === 'Workshop') {
                    iconName = "tools";
                    IconComponent = FontAwesome5;
                    iconSize = 25;
                }

                return (
                    <TouchableOpacity
                        key={route.name}
                        className="flex-1 items-center"
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ width: tabWidth }}
                    >
                        <View className={`w-full h-full items-center justify-start rounded-t-2xl ${isFocused ? 'bg-gray-300' : ''}`}>
                            <IconComponent name={iconName} size={iconSize} color="#023535" className="mt-[20px]" />
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const InfoWithTab = ({ navigation, route }) => {
    const { width } = Dimensions.get("window");

    return (
        <View className="flex-1">
            <Info navigation={navigation} route={route} />
            <View className="flex-row justify-around items-center absolute bottom-0 h-[68px] bg-white rounded-t-2xl" style={{ width: '85%', alignSelf: 'center', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 6, elevation: 10 }}>
                <TouchableOpacity className="flex-1 items-center" onPress={() => navigation.navigate('Home')} style={{ width: width * 0.85 / 4 }}>
                    <View className="w-full h-full items-center justify-center rounded-t-2xl">
                        <FontAwesome5 name="home" size={25} color="#023535" className="mt-[20px]" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 items-center" onPress={() => navigation.navigate('Notes')} style={{ width: width * 0.85 / 4 }}>
                    <View className="w-full h-full items-center justify-center rounded-t-2xl">
                        <MaterialCommunityIcons name="note-edit" size={28} color="#023535" className="mt-[20px]" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 items-center" onPress={() => navigation.navigate('Market')} style={{ width: width * 0.85 / 4 }}>
                    <View className="w-full h-full items-center justify-center rounded-t-2xl">
                        <FontAwesome5 name="shopping-basket" size={25} color="#023535" className="mt-[20px]" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 items-center" onPress={() => navigation.navigate('Workshop')} style={{ width: width * 0.85 / 4 }}>
                    <View className="w-full h-full items-center justify-center rounded-t-2xl">
                        <FontAwesome5 name="tools" size={25} color="#023535" className="mt-[20px]" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};


function LoginNav() {
    return (
        <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
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
                    component={InfoWithTab} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="History" 
                    component={History} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="NotesPage" 
                    component={NotesPage} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="CarNotes" 
                    component={CarNotes} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
