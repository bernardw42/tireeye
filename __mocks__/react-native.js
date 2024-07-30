// __mocks__/react-native.js
const reactNative = jest.requireActual('react-native');

reactNative.BackHandler = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

module.exports = reactNative;
