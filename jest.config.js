module.exports = {
    preset: 'react-native',
    transformIgnorePatterns: [
      "node_modules/(?!(react-native|@react-native|@react-navigation|react-navigation|expo|@react-native-async-storage/async-storage)/)",
      "node_modules/(?!(@react-native|react-native|react-native-responsive-screen)/)",
      "node_modules/(?!(react-native|@react-native|react-native-web|@react-navigation|@react-native-community|firebase)/)",
      "/node_modules/(?!(@react-native|react-native|firebase|@firebase|@testing-library)/)",
    ],
    transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy',
    },
  };
  

