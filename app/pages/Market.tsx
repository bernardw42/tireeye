import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { encode as btoa } from 'base-64';
import stockImage from '../../assets/stock.png'; // Ensure this path is correct
import Swiper from "react-native-swiper"
import { Animated } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const clientId = 'BernardW-TireEye-SBX-3734da688-22033a69';
const clientSecret = 'SBX-734da68800c2-2693-4d3c-aa7f-b6ec';
const conversionRate = 14500; // Example conversion rate from USD to IDR
interface Product {
    itemId: string;
    title: string;
    image: { imageUrl: string };
    price: { value: string };
    itemWebUrl: string;
    rating?: number;
    soldQuantity?: number;
    shopName?: string;
}

const getToken = async () => {
    const credentials = btoa(`${clientId}:${clientSecret}`);
    const response = await fetch('https://api.sandbox.ebay.com/identity/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
    });
    const data = await response.json();
    return data.access_token;
};

const fetchProducts = async (token: string, query: string) => {
    try {
        const response = await fetch(
            `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${query}&limit=10`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const data = await response.json();
        return data.itemSummaries || [];
    } catch (error) {
        console.error("Error fetching products: ", error);
        throw error;
    }
};

export default function Market({ route }: { route: any }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const scrollY = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            setError(false);
            try {
                const token = await getToken();
                setToken(token);
                const initialQuery = route.params?.searchQuery || '';
                setQuery(initialQuery);
                const items = await fetchProducts(token, initialQuery || 'car'); // Default search query if empty
                setProducts(items);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, [route.params?.searchQuery]);

    const handleSearch = async () => {
        if (token) {
            setLoading(true);
            setError(false);
            try {
                const searchQuery = query || 'car'; // Use default query if search bar is empty
                const items = await fetchProducts(token, searchQuery);
                setProducts(items);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleReload = async () => {
        if (token) {
            handleSearch();
        }
    };

    const renderCarouselItem = (item: Product) => (
        <TouchableOpacity
            key={item.itemId}
            className="flex-1 m-2 p-2"
            onPress={() => Linking.openURL(item.itemWebUrl)}
        >
            <Image
                source={item.image?.imageUrl ? { uri: item.image.imageUrl } : stockImage}
                className="w-full h-48 object-cover"
            />
            <Text className="text-lg font-bold mt-2">{item.title}</Text>
            <Text className="text-lg text-gray-700 mt-1">Rp {(parseFloat(item.price.value) * conversionRate).toLocaleString('id-ID')}</Text>
        </TouchableOpacity>
    );

    const renderProductItem = (item: Product) => (
        <TouchableOpacity
            key={item.itemId}
            className="w-1/2 p-2"
            onPress={() => Linking.openURL(item.itemWebUrl)}
        >
            <View className="flex-1 rounded-lg"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 5,
                    backgroundColor: 'white',
                }}>
                <Image
                    source={item.image?.imageUrl ? { uri: item.image.imageUrl } : stockImage}
                    className="w-full h-40 object-cover rounded-md"
                />
                <View className='p-2'>
                    <Text className="text-sm font-bold mt-2" numberOfLines={2}>{item.title}</Text>
                    <Text className="text-lg font-bold mt-1">Rp {(parseFloat(item.price.value) * conversionRate).toLocaleString('id-ID')}</Text>
                    <View className="flex-row items-center mt-1">
                        <Text className="text-sm text-gray-700 mr-2">★ {item.rating || 4.5}</Text>
                        <Text className="text-sm text-gray-700">{item.soldQuantity || 100} sold</Text>
                    </View>
                    <Text className="text-sm text-gray-700 mt-1">{item.shopName || 'Shop Name'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const headerElevation = scrollY.interpolate({
        inputRange: [0, 10],
        outputRange: [0, 5],
        extrapolate: 'clamp',
    });

    return (
        <View className="flex-1 bg-white">
            <Animated.View
                className="flex-row items-center px-4 pb-2 bg-white absolute top-0 w-full pt-[50px] z-50"
                style={{
                    elevation: headerElevation,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: headerElevation ? 0.2 : 0,
                    shadowRadius: 2,
                }}
            >
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search for products"
                    className="flex-1 px-6 py-2 rounded-full bg-gray-200"
                />
                <TouchableOpacity onPress={handleSearch} className="ml-2 p-3 bg-[#023535] rounded-full justify-center items-center">
                    <FontAwesome name="search" size={20} color="white" />
                </TouchableOpacity>
            </Animated.View>

            <Animated.ScrollView
                className="flex-1 pt-[100px] px-4"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {loading ? (
                    <View className="flex-1 justify-center items-center mt-[100px]">
                        <ActivityIndicator size="large" color="#023535" />
                        <Text>Searching For Your Products...</Text>
                    </View>
                ) : error || products.length === 0 ? (
                    <View className="flex-1 justify-center items-center mt-[100px]">
                        <Text className="text-center mb-4">{error ? "There is something wrong with your connection, do you want to reload?" : "This product is currently unavailable, sorry for the inconvenience"}</Text>
                        <TouchableOpacity
                            className="p-3 bg-[#023535] rounded-full"
                            onPress={handleReload}
                        >
                            <FontAwesome5 name="redo" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <Text className="text-lg text-[#023535] font-bold mb-2 mt-2">Featured Products</Text>
                        {products.length > 0 && (
                            <View className='px-2 mb-2'>
                                <View className="flex mb-4 w-full h-[220px] justify-center"
                                    style={{
                                        borderRadius: 12,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 2, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 2,
                                        elevation: 5,
                                        backgroundColor: 'white',
                                    }}>
                                    <Swiper
                                        autoplay={true}
                                        autoplayTimeout={5}
                                        showsPagination={true}
                                        dotStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', width: 8, height: 8, borderRadius: 4 }}
                                        activeDotStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', width: 8, height: 8, borderRadius: 4 }}
                                    >
                                        {products.slice(0, 4).map((item) => (
                                            <TouchableOpacity key={item.itemId} className='w-full px-12 justify-center' onPress={() => Linking.openURL(item.itemWebUrl)}>
                                                {renderCarouselItem(item)}
                                            </TouchableOpacity>
                                        ))}
                                    </Swiper>
                                </View>
                            </View>
                        )}

                        <Text className="text-lg font-bold text-[#023535] mb-1.5">Product Search Results</Text>
                        <View className="flex-wrap flex-row justify-between">
                            {products.map((item) => renderProductItem(item))}
                        </View>
                    </>
                )}
                <View className='h-[185px]'></View>
            </Animated.ScrollView>
        </View>
    );
};
