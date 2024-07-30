import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Button, Dimensions } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

export default function Scan() {
  const navigation = useNavigation();
  const cameraRef = useRef<any>(null);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      let photo = await cameraRef.current.takePictureAsync();
      setImageUri(photo.uri);
      navigation.navigate('Info', { imageUri: photo.uri });
    }
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === 'back'
        ? 'front'
        : 'back'
    );
  };

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImageUri(selectedImage);
      navigation.navigate('Info', { imageUri: selectedImage });
    }
  };
  
  

  useEffect(() => {
    if (permission && !permission.granted) {
      (async () => {
        const { status } = await requestPermission();
        if (status === 'granted') {
          // Permission granted
        } else {
          // Permission denied
          console.log('Camera permission denied');
        }
      })();
    }
  }, [permission, requestPermission]);

  return (
    <View className="flex-1">
      {permission && !permission.granted ? (
        <View className="flex-1 justify-center items-center">
          <Text>We need your permission to access the camera</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      ) : (
        <CameraView
          className="flex-1"
          facing={cameraType}
          onCameraReady={() => setIsCameraReady(true)}
          ref={cameraRef}
        >
          <View className="flex-1 relative">
            {/* Top left back arrow */}
            <View className="absolute top-0 left-0 right-0 z-10">
              <View className="absolute top-0 left-0 right-0 bg-black opacity-50 h-[300px]"></View>
              <TouchableOpacity className="pt-[50px] ml-[16px] pb-[20px] z-20" onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={35} color="white" />
              </TouchableOpacity>
            </View>

            {/* Transparent black overlay with circular cutout */}
            <View className="absolute inset-0 flex items-center justify-center">
              <View
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: 125,
                  borderWidth: 2,
                  borderColor: 'white',
                  backgroundColor: 'transparent',
                  position: 'absolute',
                  top: height / 2 - 125, // Center vertically
                  left: width / 2 - 125, // Center horizontally
                }}
              ></View>
            </View>

            {/* Bottom black rectangle with buttons */}
            <View className="absolute bottom-0 w-full">
              <View className="absolute bottom-0 left-0 right-0 bg-black opacity-50 h-[150px]"></View>
              <View className="flex-row justify-around w-full items-center py-10">
                <TouchableOpacity onPress={switchCamera} className="bg-white rounded-full p-5 z-30">
                  <MaterialCommunityIcons name="camera-switch" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture} className="bg-white rounded-full p-5 z-30">
                  <FontAwesome5 name="camera" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={openImagePicker} className="bg-white rounded-full p-5 z-30">
                  <MaterialCommunityIcons name="image" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
};
