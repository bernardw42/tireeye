import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, Linking, Image, TouchableOpacity, Share, ActivityIndicator, Platform } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import MapView, { Marker, Callout } from "react-native-maps";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [showError, setShowError] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          setIsLoading(false);
          setShowError(true);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location as LocationType);
        setIsLoading(false);
      } catch (error) {
        console.log('Error getting location:', error);
        setIsLoading(false);
        setShowError(true);
      }
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

  const handleMapRegionChange = (region: { latitude: number; longitude: number; }) => {
    if (location) {
      const distance = Math.sqrt(
        Math.pow(region.latitude - location.coords.latitude, 2) +
        Math.pow(region.longitude - location.coords.longitude, 2)
      );

      if (distance > 0.005) {
        setShowRecenterButton(true);
      } else {
        setShowRecenterButton(false);
      }
    }
  };

  const handleRecenter = () => {
    if (location && mapRef.current) {
      const newLatitude = location.coords.latitude - 0.005;
  
      mapRef.current.animateToRegion({
        latitude: newLatitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    }
    setShowRecenterButton(false);
  };

  const handleMapPress = (e: { nativeEvent: { coordinate: { latitude: any; longitude: any; }; }; }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });
  };

  const handleMarkerPress = (workshop: React.SetStateAction<WorkshopType | null>) => {
    const { lat, lng } = workshop.geometry.location;
    const newLatitude = lat - 0.005;
  
    mapRef.current.animateToRegion({
      latitude: newLatitude,
      longitude: lng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });
  
    setSelectedWorkshop(workshop);
  };

  const handleReload = () => {
    setShowError(false);
    setIsLoading(true);
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          setIsLoading(false);
          setShowError(true);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location as LocationType);
        setIsLoading(false);
      } catch (error) {
        console.log('Error getting location:', error);
        setIsLoading(false);
        setShowError(true);
      }
    })();
  };

  return (
    <View className="flex-1 justify-center items-center">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#023535" />
          <Text>Loading map...</Text>
        </View>
      ) : showError ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-center mb-4">There is something wrong with your connection, do you want to reload?</Text>
          <TouchableOpacity
            className="p-3 bg-[#023535] rounded-full"
            onPress={handleReload}
          >
            <FontAwesome5 name="redo" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="flex-row top-0 pt-[150px] pb-[20px] bg-white items-center justify-between w-full">
            <View className="flex-1 items-start pl-4">
              <TouchableOpacity
                className={`${findWorkshopsPressed ? 'bg-[#023535]' : 'bg-gray-400'} w-[50px] h-[50px] items-center justify-center rounded-lg shadow-lg duration-500`}
                onPress={clearWorkshops}
                disabled={!findWorkshopsPressed}
              >
                <MaterialCommunityIcons name="broom" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View className="flex-1 items-center">
              <TouchableOpacity className="bg-[#023535] w-[135px] h-[50px] justify-center rounded-lg items-center" onPress={fetchWorkshops}>
                <Text className="text-white text-center font-semibold">Find Workshops</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 items-end pr-4">
              <TouchableOpacity
                className={`${showRecenterButton ? 'bg-[#023535]' : 'bg-gray-400'} w-[50px] h-[50px] items-center justify-center rounded-lg shadow-lg duration-2000`}
                onPress={handleRecenter}
                disabled={!showRecenterButton}
              >
                <FontAwesome5 name="location-arrow" size={18} color="white" />
              </TouchableOpacity>
            </View>
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
                  onPress={() => handleMarkerPress(workshop)}
                >
                  <Callout>
                    <Text>{workshop.name}</Text>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          )}
  
          {selectedWorkshop && (
            <View className="absolute bottom-[120px] w-[360px] bg-[#023535] bg-opacity-90 rounded-xl p-4">
              <View className="flex-row items-center">
                {selectedWorkshop.photo ? (
                  <Image source={{ uri: selectedWorkshop.photo }} style={{ width: 120, height: 75, marginRight: 10, borderRadius: 10 }} />
                ) : (
                  <View style={{ width: 150, height: 80, marginRight: 10, backgroundColor: '#e0e0e0', borderRadius: 10 }} />
                )}
                <View className="flex-1">
                  <Text className="font-bold mb-1 text-white" numberOfLines={1} ellipsizeMode="tail">
                    {selectedWorkshop.name}
                  </Text>
                  <Text className="mb-1 text-white" numberOfLines={2} ellipsizeMode="tail">
                    {selectedWorkshop.vicinity}
                  </Text>
                  {selectedWorkshop.rating ? (
                    <Text className="mb-1 text-white">Rating: {selectedWorkshop.rating} ★</Text>
                  ) : (
                    <View style={{ width: 75, height: 20, marginBottom: 10, backgroundColor: '#e0e0e0', borderRadius: 10 }} />
                  )}
                </View>
              </View>
              <View className="items-center mt-2">
                <TouchableOpacity className="bg-white p-2 mt-1 rounded-lg items-center w-full" onPress={() => handleDirections(selectedWorkshop)}>
                  <Text className="text-center text-[#023535] font-medium">Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white p-2 mt-1 rounded-lg items-center w-full" onPress={() => handleShare(selectedWorkshop)}>
                  <Text className="text-[#023535] text-center font-medium">Share</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-500 p-2 mt-1 rounded-lg items-center w-full" onPress={() => setSelectedWorkshop(null)}>
                  <Text className="text-white text-center">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
  
          {isFetchingWorkshops && (
            <View className="absolute justify-center items-center bg-white w-[200px] h-[100px] rounded-2xl">
              <ActivityIndicator size="large" color="#023535" />
              <Text className="text-black">Searching for workshops...</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}
