module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(scss|sass|css)$": "identity-obj-proxy"
  }
};
