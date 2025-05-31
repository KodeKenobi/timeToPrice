// Use Expo's recommended metro config as a base
const { getDefaultConfig } = require("@expo/metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");

const config = getDefaultConfig(__dirname);

// Comment out or remove the blockList section
// config.resolver.blockList = exclusionList([
//   /node_modules\/ws\/.*/,
//   /node_modules\/events\/.*/,
//   /node_modules\/stream\/.*/,
//   /node_modules\/buffer\/.*/,
//   /buffer\//,
//   /node_modules\/process\/.*/,
//   /node_modules\/util\/.*/,
//   /node_modules\/crypto\/.*/,
// ]);

config.resolver.extraNodeModules = require("node-libs-react-native");

module.exports = config;
