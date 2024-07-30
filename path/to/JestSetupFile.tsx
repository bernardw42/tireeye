// JestSetupFile.tsx
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native/Libraries/Image/Image', () => {
  const actualImage = jest.requireActual('react-native/Libraries/Image/Image');
  actualImage.resolveAssetSource = jest.fn(() => ({ uri: 'mocked_image_uri' }));
  return actualImage;
});

jest.mock('react-native-gesture-handler', () => {
  return {
    ...jest.requireActual('react-native-gesture-handler'),
    GestureHandlerRootView: jest.fn(({ children }) => children),
    Directions: {},
    State: {},
    GestureDetector: jest.fn(),
    Swipeable: jest.fn(),
    TouchableOpacity: jest.fn(),
  };
});

// Mock useCameraPermissions hook
jest.mock('expo-camera', () => ({
  useCameraPermissions: jest.fn().mockReturnValue([true, jest.fn()]), // Mocking the return value as [true, requestPermission]
}));
