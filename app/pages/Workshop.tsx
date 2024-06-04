import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, Linking, Image, TouchableOpacity, Share, ActivityIndicator, Platform } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import MapView, { Marker, Callout } from "react-native-maps";
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDeBosY3h1V3eFw0ZhjxL0a6q6liZ2Zt14';

type LocationType = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

type WorkshopType = {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: { photo_reference: string }[];
  rating?: number;
  photo?: string;
};

export default function Workshop() {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [workshops, setWorkshops] = useState<WorkshopType[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopType | null>(null);
  const [findWorkshopsPressed, setFindWorkshopsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingWorkshops, setIsFetchingWorkshops] = useState(false);
  const [showRecenterButton, setShowRecenterButton] = useState(false);
  const [showCompassButton, setShowCompassButton] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location as LocationType);
      setIsLoading(false);
    })();
  }, []);

  const fetchWorkshops = async () => {
    if (location) {
      setIsFetchingWorkshops(true);
      const { latitude, longitude } = location.coords;
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=car_repair&key=${GOOGLE_MAPS_API_KEY}`;

      try {
        const response = await axios.get(url);
        console.log(response.data.results);

        if (response.data.status === "OK") {
          const workshopsWithPhotos = response.data.results.map((workshop: WorkshopType) => {
            const photoReference = workshop.photos?.[0]?.photo_reference;
            if (photoReference) {
              const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
              workshop.photo = photoUrl;
            }
            return workshop;
          });
          setWorkshops(workshopsWithPhotos);
          setFindWorkshopsPressed(true);
        } else {
          console.error("Error fetching workshops: ", response.data.status);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingWorkshops(false);
      }
    }
  };

  const clearWorkshops = () => {
    setWorkshops([]);
    setSelectedWorkshop(null);
    setFindWorkshopsPressed(false);
  };

  const handleDirections = (workshop: WorkshopType) => {
    const { lat, lng } = workshop.geometry.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const handleShare = async (workshop: WorkshopType) => {
    const { lat, lng } = workshop.geometry.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    try {
      await Share.share({
        message: `Check out this workshop: ${workshop.name}\n\nLocation: ${url}`,
      });
    } catch (error) {
      console.error('Error sharing workshop: ', error);
    }
  };

  const handleSave = (workshop: WorkshopType) => {
    const savedWorkshop = {
      name: workshop.name,
      address: workshop.vicinity,
      direction: `https://www.google.com/maps/dir/?api=1&destination=${workshop.geometry.location.lat},${workshop.geometry.location.lng}`
    };
    console.log('Workshop saved:', savedWorkshop);
    // Implement the logic to save the workshop details to the backend
  };

  const handleMapRegionChange = (region) => {
    if (location) {
      const distance = Math.sqrt(
        Math.pow(region.latitude - location.coords.latitude, 2) +
        Math.pow(region.longitude - location.coords.longitude, 2)
      );

      if (distance > 0.001) {
        setShowRecenterButton(true);
      } else {
        setShowRecenterButton(false);
      }
    }
  };

  const handleRecenter = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    }
    setShowRecenterButton(false);
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });
  };

  return (
    <View className="flex-1">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading map...</Text>
        </View>
      ) : (
        <>
          <View className="flex top-0 pt-[50px] pb-[20px] bg-white items-center">
            <TouchableOpacity className="bg-green-500 p-2 rounded-lg items-center" onPress={fetchWorkshops}>
              <Text className="text-white text-center">Find Workshops</Text>
            </TouchableOpacity>
          </View>
          {location && (
            <MapView
              ref={mapRef}
              style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              onRegionChangeComplete={handleMapRegionChange}
              onPress={handleMapPress}
              showsUserLocation={true}
              showsMyLocationButton={Platform.OS === 'android' ? false : true}
              showsCompass={false}
            >
              {workshops.map((workshop) => (
                <Marker
                  key={workshop.place_id}
                  coordinate={{
                    latitude: workshop.geometry.location.lat,
                    longitude: workshop.geometry.location.lng,
                  }}
                  onPress={() => setSelectedWorkshop(workshop)}
                >
                  <Callout>
                    <Text>{workshop.name}</Text>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          
          )}
          <View className="absolute top-24 left-0 right-0 flex-row justify-between p-4">
            <View className="flex-1 items-start">
              {findWorkshopsPressed ? (
                <TouchableOpacity
                  className="bg-white p-3 rounded-lg shadow-lg"
                  onPress={clearWorkshops}
                >
                  <MaterialCommunityIcons name="broom" size={24} color="black" />
                </TouchableOpacity>
              ) : (
                <View className="p-3 rounded-lg opacity-0">
                  <MaterialCommunityIcons name="broom" size={24} color="transparent" />
                </View>
              )}
            </View>
            <View className="flex-1 items-end">
              <TouchableOpacity
                className="bg-white p-3 rounded-lg shadow-lg"
                onPress={handleRecenter}
              >
                <FontAwesome5 name="location-arrow" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>


          {selectedWorkshop && (
            <View className="absolute bottom-28 left-2.5 right-2.5 bg-white bg-opacity-90 rounded-xl p-4">
              <View className="items-center">
                <Text className="font-bold mb-1">{selectedWorkshop.name}</Text>
                <Text className="mb-1">{selectedWorkshop.vicinity}</Text>
                {selectedWorkshop.photo ? (
                  <Image source={{ uri: selectedWorkshop.photo }} style={{ width: 200, height: 100, marginBottom: 10 }} />
                ) : (
                  <View style={{ width: 200, height: 100, marginBottom: 10, backgroundColor: '#e0e0e0' }} />
                )}
                {selectedWorkshop.rating ? (
                  <Text className="mb-1">Rating: {selectedWorkshop.rating} ★</Text>
                ) : (
                  <View style={{ width: 100, height: 20, marginBottom: 10, backgroundColor: '#e0e0e0' }} />
                )}
                <TouchableOpacity className="bg-blue-500 p-2 mt-1 rounded-lg items-center w-full" onPress={() => handleDirections(selectedWorkshop)}>
                  <Text className="text-white text-center">Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-blue-500 p-2 mt-1 rounded-lg items-center w-full" onPress={() => handleShare(selectedWorkshop)}>
                  <Text className="text-white text-center">Share</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-blue-500 p-2 mt-1 rounded-lg items-center w-full" onPress={() => handleSave(selectedWorkshop)}>
                  <Text className="text-white text-center">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-500 p-2 mt-1 rounded-lg items-center w-full" onPress={() => setSelectedWorkshop(null)}>
                  <Text className="text-white text-center">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
      {isFetchingWorkshops && (
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-black">Searching for workshops...</Text>
        </View>
      )}
    </View>
  );
}
