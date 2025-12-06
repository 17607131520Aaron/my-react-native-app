module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  clearMocks: true,
  resetMocks: true,
};
