module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Path alias plugin
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/hooks': './src/hooks',
            '@/utils': './src/utils',
            '@/constants': './src/constants',
            '@/types': './src/types',
            '@/stores': './src/stores',
            '@/services': './src/services',
            '@/libs': './src/libs',
            '@/navigation': './src/navigation',
          },
        },
      ],
      // Reanimated plugin (반드시 마지막에 위치)
      'react-native-reanimated/plugin',
    ],
  }
}
