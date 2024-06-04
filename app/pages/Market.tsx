import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking, TextInput } from 'react-native';
import React from 'react';
import { encode as btoa } from 'base-64';

const clientId = 'BernardW-TireEye-SBX-3734da688-22033a69';
const clientSecret = 'SBX-734da68800c2-2693-4d3c-aa7f-b6ec';
const conversionRate = 14500; // Example conversion rate from USD to IDR

interface Product {
    itemId: string;
    title: string;
    image: { imageUrl: string };
    price: { value: string };
    itemWebUrl: string;
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
        return [];
    }
};

export default function Market() {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState('Tire');
    const [token, setToken] = useState('');

    useEffect(() => {
        const initialize = async () => {
            const token = await getToken();
            setToken(token);
            const items = await fetchProducts(token, query);
            setProducts(items);
        };
        initialize();
    }, []);

    const handleSearch = async () => {
        if (token) {
            const items = await fetchProducts(token, query);
            setProducts(items);
        }
    };

    const renderItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            className="flex-1 m-2 p-2 border border-gray-300 rounded-lg"
            onPress={() => Linking.openURL(item.itemWebUrl)}
        >
            <Image
                source={{ uri: item.image.imageUrl }}
                className="w-full h-48 object-cover rounded-md"
            />
            <Text className="text-lg font-bold mt-2">{item.title}</Text>
            <Text className="text-lg text-gray-700 mt-1">Rp {(parseFloat(item.price.value) * conversionRate).toLocaleString('id-ID')}</Text>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-yellow-400 p-4">
            <Text className="text-2xl font-bold text-center mb-4">mARMarketttt</Text>
            <View className="flex-row mb-4">
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search for products"
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <TouchableOpacity onPress={handleSearch} className="ml-2 p-2 bg-blue-500 rounded-lg">
                    <Text className="text-white font-bold">Search</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.itemId}
                className="flex-1"
            />
        </View>
    );
}

