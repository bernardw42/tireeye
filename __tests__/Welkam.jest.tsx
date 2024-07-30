import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import Welkam from '../app/pages/Welkam';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('Welkam Screen', () => {
  it('renders correctly and handles button press', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Welkam />
      </NavigationContainer>
    );

    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@firstlaunch', 'true');
    });

    const logInButton = getByText('Log In');
    fireEvent.press(logInButton);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@firstlaunch', 'true');
    });
  });
});
