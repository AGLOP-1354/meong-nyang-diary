/* eslint-disable @typescript-eslint/no-require-imports, import/no-commonjs, @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
}
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
}

config.resolver.alias = {
  '@': './src',
  '@/components': './src/components',
  '@/screens': './src/screens',
  '@/hooks': './src/hooks',
  '@/utils': './src/utils',
  '@/constants': './src/constants',
  '@/types': './src/types',
  '@/stores': './src/stores',
  '@/services': './src/services',
  '@/navigation': './src/navigation',
  '@assets': './assets',
}

config.watchFolders = [__dirname]

config.server = {
  ...config.server,
  port: 8081,
  timeout: 60000,
}

config.resetCache = false

module.exports = config
