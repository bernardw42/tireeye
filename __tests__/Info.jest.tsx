// __tests__/Info.jest.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Info from '../app/pages/Info';
import { useRoute, useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useRoute: jest.fn(),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

describe('<Info />', () => {
  beforeAll(() => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { imageUri: 'mock-uri' },
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Info />
      </NavigationContainer>
    );

    expect(getByText('Brand')).toBeTruthy();
    expect(getByText('MockBrand')).toBeTruthy();
    expect(getByText('Size')).toBeTruthy();
    expect(getByText('225/50R17')).toBeTruthy();
    expect(getByText('Type')).toBeTruthy();
    expect(getByText('All-Season')).toBeTruthy();
    expect(getByText('DOT')).toBeTruthy();
    expect(getByText('DOT123456')).toBeTruthy();
  });

  it('has 2 child', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Info />
      </NavigationContainer>
    );

    const tree = getByTestId('info-container');
    expect(tree.children.length).toBe(2);
  });
});
