const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-paper', 'react-native-vector-icons'],
      },
    },
    argv
  );

  // Customize the config before returning it.
  return config;
};

