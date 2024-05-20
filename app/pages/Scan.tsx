import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Button } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Scan() {
  const navigation = useNavigation();
  const cameraRef = useRef<any>(null);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      let photo = await cameraRef.current.takePictureAsync();
      // Handle captured photo (e.g., save to state, display, etc.)
      console.log("Photo captured:", photo);
    }
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === 'back'
        ? 'front'
        : 'back'
    );
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
    <View style={{ flex: 1 }}>
      {permission && !permission.granted ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>We need your permission to access the camera</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      ) : (
        <CameraView
          style={{ flex: 1 }}
          facing={cameraType}
          onCameraReady={() => setIsCameraReady(true)}
          ref={cameraRef}
        >
          <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
              </TouchableOpacity>
              <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: 'white' }} />
              <TouchableOpacity onPress={switchCamera}>
                <MaterialCommunityIcons name="camera-switch" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
              <TouchableOpacity onPress={takePicture} style={{ backgroundColor: 'white', borderRadius: 50, padding: 20, marginHorizontal: 20 }}>
                <FontAwesome5 name="camera" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={{ backgroundColor: 'white', borderRadius: 50, padding: 20, marginHorizontal: 20 }}>
                <MaterialCommunityIcons name="image" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}



