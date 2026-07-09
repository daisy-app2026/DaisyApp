const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude build and native folders from the Metro file watcher/resolver
config.resolver.blockList = [
  /[\\/]android[\\/]/,
  /[\\/]ios[\\/]/,
  /[\\/]\.gradle[\\/]/,
];

module.exports = config;
