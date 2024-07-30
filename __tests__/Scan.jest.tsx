import * as React from 'react';
import renderer from 'react-test-renderer';
import Scan from '../app/pages/Scan';

// Mock useCameraPermissions and useNavigation
import { useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

// Mock useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Mock expo-camera
jest.mock('expo-camera', () => ({
  useCameraPermissions: jest.fn(),
}));

jest.mock("expo-camera")

describe('<Scan/>', () => {
  beforeEach(() => {
    const mockUseCameraPermissions = jest.fn().mockReturnValue([
      { granted: true },
      jest.fn().mockResolvedValue({ status: 'granted' }),
    ]);
    (useCameraPermissions as jest.Mock).mockImplementation(mockUseCameraPermissions);
  });

  it('has 4 children', () => {
    const tree = renderer.create(<Scan />).toJSON();
    expect(tree && tree.children.length).toBe(4); // Adjust as per your component
  });

  it('renders correctly', () => {
    const tree = renderer.create(<Scan />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
