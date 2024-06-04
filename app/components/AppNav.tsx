import React from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const { width } = Dimensions.get("window");
    const tabWidth = width * 0.85 / state.routes.length;

    if (state.routes[state.index].name === 'Home') {
        return null;
    }

    return (
        <View className="flex-row justify-around absolute bottom-0 h-[80px] bg-white rounded-t-2xl shadow-2xl" style={{ width: '85%', alignSelf: 'center' }}>
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
                    iconSize = 30;
                } else if (route.name === 'Notes') {
                    iconName = "note-edit";
                    IconComponent = MaterialCommunityIcons;
                    iconSize = 35;
                } else if (route.name === 'Market') {
                    iconName = "shopping-basket";
                    IconComponent = FontAwesome5;
                    iconSize = 30;
                } else if (route.name === 'Workshop') {
                    iconName = "tools";
                    IconComponent = FontAwesome5;
                    iconSize = 30;
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
                    component={Info} 
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}
